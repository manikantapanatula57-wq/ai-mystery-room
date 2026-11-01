# AI Mystery Room

An AI-powered interactive investigation game. Users create fictional cases, inspect evidence, and submit a final accusation.

## Requirements

- Node.js 20+
- MongoDB instance
- Google Gemini API key

## Setup

1. Install dependencies from the repository root with `npm install`, then `npm --prefix server install` and `npm --prefix client install`.
2. Copy `server/.env.example` to `server/.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
3. Run `npm run dev`. The Vite client runs on port 5173 and proxies `/api` to the Express server on port 5000.

Without a Gemini key, generation reports a clear provider error instead of quietly substituting mock mysteries. CCTV evidence is text-based and explicitly labeled as a simulation.

## API and security

The API returns only public mystery fields before accusation. The stored solution is excluded from normal queries; the accusation endpoint compares the answer server-side, makes the submission permanent, and then exposes results. All mystery and investigation routes verify ownership.
