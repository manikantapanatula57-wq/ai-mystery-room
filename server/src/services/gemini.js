import { z } from 'zod';

const suspectSchema = z.object({
  suspectId: z.string(), name: z.string(), age: z.number(), occupation: z.string(),
  background: z.string(), relationship: z.string(), motive: z.string(), alibi: z.string(),
  suspiciousBehavior: z.string(), publicProfile: z.string(),
});

const evidenceSchema = z.object({
  evidenceId: z.string(), title: z.string(),
  type: z.enum(['Chat', 'Photo', 'CCTV simulation', 'Witness', 'Document']),
  description: z.string(), content: z.any(), timestamp: z.string(),
  relatedSuspectIds: z.array(z.string()).default([]),
  location: z.string().optional(), isSimulation: z.boolean().optional(),
});

const mysterySchema = z.object({
  title: z.string(), category: z.string(), difficulty: z.string(), description: z.string(),
  incident: z.object({ location: z.string(), date: z.string(), time: z.string(), description: z.string() }),
  timeline: z.array(z.object({ time: z.string(), event: z.string() })),
  suspects: z.array(suspectSchema).min(3).max(6),
  evidence: z.array(evidenceSchema).min(4),
  solution: z.object({
    culpritId: z.string(), motive: z.string(), method: z.string(), explanation: z.string(),
    supportingEvidenceIds: z.array(z.string()).min(2),
  }),
});

const fail = (message, status, code, extra = {}) =>
  Object.assign(new Error(message), { status, code, ...extra });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const REQUEST_TIMEOUT_MS = 150000; // 2.5 minutes

async function callGemini(model, prompt) {
  const started = Date.now();
  console.log(`Calling Gemini [${model}]...`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8,
            maxOutputTokens: 16384,
          },
        }),
      }
    );
  } catch (err) {
    console.error(`Gemini request failed [${model}] after ${Date.now() - started}ms:`, err.name, err.message);
    // providerStatus 504 = timeout / network error, not retried (would take too long)
    throw fail('The mystery provider timed out. Please try again.', 503, 'AI_PROVIDER_UNAVAILABLE', {
      providerStatus: 504,
    });
  } finally {
    clearTimeout(timer);
  }

  console.log(`Gemini responded [${model}] in ${Date.now() - started}ms, status ${response.status}`);

  if (!response.ok) {
    const body = await response.text();
    console.error(`Gemini error [${model}]:`, response.status, body);
    throw fail('The mystery provider is temporarily unavailable.', 503, 'AI_PROVIDER_UNAVAILABLE', {
      providerStatus: response.status,
    });
  }
  return response.json();
}

async function callWithRetry(prompt) {
  const primary = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const fallback = process.env.GEMINI_FALLBACK_MODEL || primary;
  const models = primary === fallback ? [primary] : [primary, fallback];

  let lastErr;
  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await callGemini(model, prompt);
      } catch (err) {
        lastErr = err;
        const retryable = err.providerStatus === 503 || err.providerStatus === 429;
        if (!retryable) break; // 400/403/404/504: retrying the same model won't help
        await sleep(1000 * 2 ** attempt); // 1s, 2s, 4s
      }
    }
  }
  throw lastErr;
}

export async function generateMystery(input) {
  if (!process.env.GEMINI_API_KEY) {
    throw fail('Mystery generation needs a configured Gemini API key.', 503, 'AI_PROVIDER_UNAVAILABLE');
  }

  // Accept either naming used by the form/route
  const category = input.category ?? input.caseType ?? 'Disappearance';
  const suspectCount = input.suspectCount ?? input.suspects ?? 4;
  const difficulty = input.difficulty ?? 'Medium';
  const scenario = input.scenario ?? '';

  const prompt = `Create a solvable fictional, non-graphic detective mystery as valid JSON only. Follow the JSON schema implied by this specification: title,category,difficulty,description,incident {location,date,time,description},timeline [{time,event}], suspects [exactly ${suspectCount} entries with suspectId,name,age,occupation,background,relationship,motive,alibi,suspiciousBehavior,publicProfile], evidence [at least 5 entries with evidenceId,title,type (Chat, Photo, CCTV simulation, Witness, or Document),description,content,timestamp,relatedSuspectIds,location,isSimulation], solution {culpritId,motive,method,explanation,supportingEvidenceIds}. Exactly one suspect is guilty, at least two evidence IDs support that answer, one item is a red herring, and all facts/timestamps/names agree. CCTV is only a clearly labeled simulation. Keep each suspect plausible. Keep every text field concise (1-3 sentences). Scenario: ${scenario}
Category: ${category}
Difficulty: ${difficulty}
Return only JSON.`;

  const data = await callWithRetry(prompt);

  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== 'STOP') {
    console.warn('Gemini finishReason:', finishReason);
  }

  const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
  if (!raw) {
    console.error('Gemini empty response:', JSON.stringify(data).slice(0, 1000));
    throw fail('The mystery provider returned an empty case.', 502, 'GENERATION_FAILED');
  }

  let parsed;
  try {
    parsed = mysterySchema.parse(JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '')));
  } catch (e) {
    console.error('Case validation failed:', e.issues ?? e.message);
    console.error('Raw output start:', raw.slice(0, 500));
    throw fail('Generated case failed validation. Please try again.', 502, 'INVALID_GENERATED_CASE');
  }

  const culpritCount = parsed.suspects.filter((s) => s.suspectId === parsed.solution.culpritId).length;
  const supportCount = parsed.evidence.filter((e) =>
    parsed.solution.supportingEvidenceIds.includes(e.evidenceId)
  ).length;
  if (culpritCount !== 1 || supportCount < 2) {
    console.error('Inconsistent solution:', { culpritCount, supportCount });
    throw fail('Generated case did not contain a consistent solution.', 502, 'INVALID_GENERATED_CASE');
  }

  console.log('Mystery generated successfully:', parsed.title);
  return parsed;
}