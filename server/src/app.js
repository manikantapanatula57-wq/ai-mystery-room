import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import api from './routes/api.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 150, standardHeaders: 'draft-7', legacyHeaders: false }), api);
app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) return res.status(422).json({ success: false, message: error.issues[0]?.message || 'Invalid request', error: { code: 'VALIDATION_ERROR' } });
  console.error(error);
  res.status(error.status || 500).json({ success: false, message: error.status ? error.message : 'Something went wrong. Please try again.', error: { code: error.code || 'INTERNAL_ERROR' } });
});

export default app;
