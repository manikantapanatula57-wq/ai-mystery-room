import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import Mystery from '../models/Mystery.js';
import Investigation from '../models/Investigation.js';
import { requireAuth } from '../middleware/auth.js';
import { generateMystery } from '../services/gemini.js';

const router = Router();
const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const tokenFor = (user) => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicMystery = (m) => ({ id: m._id, title: m.title, scenario: m.scenario, category: m.category, difficulty: m.difficulty, status: m.status, description: m.description, incident: m.incident, timeline: m.timeline, suspects: m.suspects, evidence: m.evidence, createdAt: m.createdAt, updatedAt: m.updatedAt });
const fail = (res, status, message, code) => res.status(status).json({ success: false, message, error: { code } });

router.post('/auth/register', wrap(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email().max(254), password: z.string().min(8).max(100) }).parse(req.body);
  const email = body.email.toLowerCase();
  if (await User.exists({ email })) return fail(res, 409, 'An account with this email already exists.', 'EMAIL_EXISTS');
  const user = await User.create({ name: body.name, email, password: await bcrypt.hash(body.password, 12) });
  res.status(201).json({ success: true, data: { token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email } } });
}));
router.post('/auth/login', wrap(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const user = await User.findOne({ email: body.email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(body.password, user.password))) return fail(res, 401, 'Email or password is incorrect.', 'INVALID_CREDENTIALS');
  res.json({ success: true, data: { token: tokenFor(user), user: { id: user._id, name: user.name, email: user.email } } });
}));
router.get('/auth/me', requireAuth, wrap(async (req, res) => {
  const user = await User.findById(req.userId).select('name email');
  res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email } } });
}));
router.post('/auth/logout', (_req, res) => res.json({ success: true, message: 'Signed out' }));

router.use(requireAuth);
router.get('/mysteries', wrap(async (req, res) => {
  const mysteries = await Mystery.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(100);
  const investigations = await Investigation.find({ userId: req.userId }).select('mysteryId status score');
  const byId = new Map(investigations.map((i) => [i.mysteryId.toString(), i]));
  res.json({ success: true, data: { mysteries: mysteries.map((m) => ({ ...publicMystery(m), investigation: byId.get(m._id.toString()) || null })) } });
}));
router.post('/mysteries/generate', wrap(async (req, res) => {
  const input = z.object({ scenario: z.string().trim().min(30).max(3000), category: z.enum(['Murder mystery', 'Theft', 'Disappearance', 'Corporate conspiracy', 'Cyber mystery', 'General mystery']), difficulty: z.enum(['Easy', 'Medium', 'Hard']), suspectCount: z.coerce.number().int().min(3).max(6), title: z.string().trim().max(100).optional() }).parse(req.body);
  console.log('[generate] request received:', input.category, input.difficulty, input.suspectCount);

  const t0 = Date.now();
  const generated = await generateMystery(input);
  console.log(`[generate] Gemini done in ${Date.now() - t0}ms`);

  const t1 = Date.now();
  const mystery = await Mystery.create({ ...generated, title: input.title || generated.title, scenario: input.scenario, category: input.category, difficulty: input.difficulty, userId: req.userId });
  await Investigation.create({ mysteryId: mystery._id, userId: req.userId });
  console.log(`[generate] saved to MongoDB in ${Date.now() - t1}ms`);

  res.status(201).json({ success: true, message: 'Mystery generated', data: { mystery: publicMystery(mystery) } });
}));
router.get('/mysteries/:id', wrap(async (req, res) => {
  const mystery = await Mystery.findOne({ _id: req.params.id, userId: req.userId });
  if (!mystery) return fail(res, 404, 'Mystery not found.', 'NOT_FOUND');
  res.json({ success: true, data: { mystery: publicMystery(mystery) } });
}));
router.delete('/mysteries/:id', wrap(async (req, res) => {
  const mystery = await Mystery.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!mystery) return fail(res, 404, 'Mystery not found.', 'NOT_FOUND');
  await Investigation.deleteOne({ mysteryId: mystery._id, userId: req.userId });
  res.json({ success: true, message: 'Mystery deleted' });
}));

router.get('/investigations/:mysteryId', wrap(async (req, res) => {
  const mystery = await Mystery.findOne({ _id: req.params.mysteryId, userId: req.userId });
  if (!mystery) return fail(res, 404, 'Mystery not found.', 'NOT_FOUND');
  let investigation = await Investigation.findOne({ mysteryId: mystery._id, userId: req.userId });
  if (!investigation) investigation = await Investigation.create({ mysteryId: mystery._id, userId: req.userId });
  const safe = investigation.toObject(); delete safe.selectedSuspectId; delete safe.userReasoning; delete safe.score; delete safe.evaluation;
  res.json({ success: true, data: { investigation: safe } });
}));
router.patch('/investigations/:mysteryId/progress', wrap(async (req, res) => {
  const mystery = await Mystery.findOne({ _id: req.params.mysteryId, userId: req.userId });
  if (!mystery) return fail(res, 404, 'Mystery not found.', 'NOT_FOUND');
  const body = z.object({ evidenceId: z.string().optional(), suspectId: z.string().optional() }).refine((v) => v.evidenceId || v.suspectId).parse(req.body);
  const update = {};
  if (body.evidenceId && mystery.evidence.some((item) => item.evidenceId === body.evidenceId)) update.$addToSet = { ...(update.$addToSet || {}), inspectedEvidenceIds: body.evidenceId };
  if (body.suspectId && mystery.suspects.some((item) => item.suspectId === body.suspectId)) update.$addToSet = { ...(update.$addToSet || {}), reviewedSuspectIds: body.suspectId };
  const investigation = await Investigation.findOneAndUpdate({ mysteryId: mystery._id, userId: req.userId, status: 'active' }, update, { new: true, upsert: true, setDefaultsOnInsert: true });
  res.json({ success: true, data: { inspectedEvidenceIds: investigation.inspectedEvidenceIds, reviewedSuspectIds: investigation.reviewedSuspectIds } });
}));
router.put('/investigations/:mysteryId/notes', wrap(async (req, res) => {
  const mystery = await Mystery.findOne({ _id: req.params.mysteryId, userId: req.userId });
  if (!mystery) return fail(res, 404, 'Mystery not found.', 'NOT_FOUND');
  const { notes } = z.object({ notes: z.array(z.object({ content: z.string().trim().min(1).max(4000), createdAt: z.coerce.date().optional() })).max(100) }).parse(req.body);
  const investigation = await Investigation.findOneAndUpdate({ mysteryId: mystery._id, userId: req.userId, status: 'active' }, { notes: notes.map((note) => ({ content: note.content, createdAt: note.createdAt || new Date(), updatedAt: new Date() })) }, { new: true, upsert: true, setDefaultsOnInsert: true });
  res.json({ success: true, data: { notes: investigation.notes } });
}));
router.post('/investigations/:mysteryId/accuse', wrap(async (req, res) => {
  const body = z.object({ suspectId: z.string(), reasoning: z.string().trim().max(2000).default('') }).parse(req.body);
  const mystery = await Mystery.findOne({ _id: req.params.mysteryId, userId: req.userId }).select('+solution');
  if (!mystery) return fail(res, 404, 'Mystery not found.', 'NOT_FOUND');
  const suspect = mystery.suspects.find((person) => person.suspectId === body.suspectId);
  if (!suspect) return fail(res, 422, 'Choose a suspect from this case.', 'INVALID_SUSPECT');
  const investigation = await Investigation.findOne({ mysteryId: mystery._id, userId: req.userId });
  if (investigation?.status === 'completed') return fail(res, 409, 'Your final accusation has already been submitted.', 'ALREADY_SUBMITTED');
  const correct = body.suspectId === mystery.solution.culpritId;
  const supported = mystery.solution.supportingEvidenceIds.filter((id) => investigation?.inspectedEvidenceIds.includes(id)).length;
  const supportingEvidence = mystery.evidence.filter((item) => mystery.solution.supportingEvidenceIds.includes(item.evidenceId));
  const reasoningTerms = [...new Set(body.reasoning.toLowerCase().match(/[a-z0-9]{5,}/g) || [])];
  const evidenceText = supportingEvidence.map((item) => `${item.title} ${item.description} ${JSON.stringify(item.content)}`).join(' ').toLowerCase();
  const groundedTerms = reasoningTerms.filter((term) => evidenceText.includes(term)).length;
  const reasoningPoints = reasoningTerms.length ? Math.round(15 * groundedTerms / reasoningTerms.length) : 0;
  const score = (correct ? 60 : 0) + Math.round(25 * supported / Math.max(1, mystery.solution.supportingEvidenceIds.length)) + reasoningPoints;
  const evaluation = { correct, culprit: mystery.suspects.find((person) => person.suspectId === mystery.solution.culpritId), motive: mystery.solution.motive, method: mystery.solution.method, explanation: mystery.solution.explanation, supportingEvidence, missedClues: supportingEvidence.filter((item) => !investigation?.inspectedEvidenceIds.includes(item.evidenceId)), otherSuspects: mystery.suspects.filter((person) => person.suspectId !== mystery.solution.culpritId).map((person) => ({ name: person.name, explanation: `${person.name} was a viable lead, but the evidence does not connect them to the incident as strongly as the solution does.` })) };
  await Investigation.findOneAndUpdate({ mysteryId: mystery._id, userId: req.userId, status: { $ne: 'completed' } }, { selectedSuspectId: body.suspectId, userReasoning: body.reasoning, score, evaluation, status: 'completed', completedAt: new Date() }, { upsert: true });
  await Mystery.updateOne({ _id: mystery._id }, { status: 'completed' });
  res.json({ success: true, data: { evaluation, score, selectedSuspect: suspect, submittedAt: new Date() } });
}));
router.get('/investigations/:mysteryId/results', wrap(async (req, res) => {
  const mystery = await Mystery.findOne({ _id: req.params.mysteryId, userId: req.userId });
  const investigation = await Investigation.findOne({ mysteryId: req.params.mysteryId, userId: req.userId, status: 'completed' });
  if (!mystery || !investigation) return fail(res, 404, 'Results are available after you submit a final accusation.', 'RESULTS_UNAVAILABLE');
  res.json({ success: true, data: { score: investigation.score, selectedSuspect: mystery.suspects.find((p) => p.suspectId === investigation.selectedSuspectId), reasoning: investigation.userReasoning, ...investigation.evaluation } });
}));

export default router;
