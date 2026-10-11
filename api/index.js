/* ============================================
   CareerPilot AI — Vercel Serverless Function API Entry
   Mounts the existing API routes as a serverless function.
   Flow: Vercel (/api/*) -> api/index.js -> Express -> Gemini
   ============================================ */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from '../server/routes/aiRoutes.js';

// Load .env in local/dev test environments if present
try {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
} catch {
  // Ignored in serverless where process.env is pre-populated
}

const app = express();

// CORS & JSON body parser
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check handler
const handleHealth = (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerPilot AI API (Vercel Serverless)',
    version: '1.0.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    timestamp: new Date().toISOString(),
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Mount AI routes on both /api/ai and /ai for rewrite tolerance
app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Root API test handler
app.get(['/api', '/'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerPilot AI API',
    endpoints: [
      '/api/health',
      '/api/ai/health',
      '/api/ai/resume-analysis',
      '/api/ai/enhance-bullet',
      '/api/ai/mentor-chat',
      '/api/ai/interview-questions',
      '/api/ai/interview-evaluate',
      '/api/ai/roadmap',
      '/api/ai/career-analysis',
      '/api/ai/recommendations',
      '/api/ai/skill-gap',
      '/api/ai/project-analysis',
      '/api/ai/job-match',
    ],
  });
});

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API route ${req.method} ${req.originalUrl || req.url} does not exist`,
  });
});

// Centralized error handling
app.use((err, req, res, _next) => {
  console.error('[Serverless API Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Export default handler for Vercel Serverless Node runtime
export default (req, res) => {
  return app(req, res);
};
