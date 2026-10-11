/* ============================================
   CareerPilot AI — Frontend AI Intelligence Service Layer
   Connects to the secure backend / Vercel Serverless Gemini API.
   No API keys are stored, exposed, or called in the browser.
   Flow: Frontend UI → Same-Origin /api → Serverless Express → Gemini
   ============================================ */

import { api } from './api';

let cachedAiHealth = null;
let lastHealthCheckTime = 0;

/**
 * Check backend Gemini AI connectivity
 */
export async function checkAiHealth(force = false) {
  const now = Date.now();
  if (!force && cachedAiHealth && (now - lastHealthCheckTime < 30000)) {
    return cachedAiHealth;
  }

  try {
    const res = await api.get('/ai/health', { timeoutMs: 12000 });
    cachedAiHealth = res.data;
    lastHealthCheckTime = now;
    return cachedAiHealth;
  } catch (err) {
    console.warn('[aiService] Backend AI health check failed:', err.message);
    cachedAiHealth = {
      connected: false,
      error: err.message || 'Unable to connect to AI server',
    };
    lastHealthCheckTime = now;
    return cachedAiHealth;
  }
}

/**
 * Compatibility helper for components:
 * Reports true when the backend AI service is operational.
 */
export function hasGeminiApiKey() {
  if (cachedAiHealth) {
    return Boolean(cachedAiHealth.connected);
  }
  return true;
}

/* ============================================
   CAREER PILOT AI OPERATIONS (FRONTEND -> SERVER)
   ============================================ */

/**
 * 1. Resume Intelligence & ATS Scoring
 */
export async function analyzeResumeAI(resumeText, targetRole = 'Software Engineer', jobDesc = '') {
  try {
    const res = await api.post('/ai/resume-analysis', {
      resumeText,
      targetRole,
      jobDesc,
    });
    if (res.data?.data) return res.data.data;
    if (res.data?.success && res.data.data) return res.data.data;
    throw new Error(res.data?.error || 'Empty response from resume analysis service');
  } catch (err) {
    console.error('[aiService] Resume analysis error:', err.message);
    throw err;
  }
}

/**
 * 2. Bullet Point Enhancer
 */
export async function enhanceBulletPointAI(bulletPoint, role = 'Software Engineer') {
  try {
    const res = await api.post('/ai/enhance-bullet', { bulletPoint, role });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Empty response from bullet enhancement service');
  } catch (err) {
    console.error('[aiService] Bullet enhance error:', err.message);
    throw err;
  }
}

/**
 * 3. AI Career Mentor Chat
 */
export async function mentorChatAI(persona, history, userProfile) {
  try {
    const res = await api.post('/ai/mentor-chat', { persona, history, userProfile });
    if (res.data?.text) return res.data.text;
    throw new Error(res.data?.error || 'Empty response from AI mentor service');
  } catch (err) {
    console.error('[aiService] Mentor chat error:', err.message);
    throw err;
  }
}

/**
 * 4. Mock Interview Question Generator
 */
export async function generateInterviewQuestionsAI(role = 'Full Stack Engineer', topic = 'Technical', difficulty = 'Mid-Level') {
  try {
    const res = await api.post('/ai/interview-questions', { role, topic, difficulty });
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
    throw new Error(res.data?.error || 'Failed to generate interview questions');
  } catch (err) {
    console.error('[aiService] Interview questions error:', err.message);
    throw err;
  }
}

/**
 * 5. Mock Interview Answer Evaluator
 */
export async function evaluateInterviewAnswerAI(question, answer, role = 'Full Stack Engineer') {
  try {
    const res = await api.post('/ai/interview-evaluate', { question, answer, role });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to evaluate interview answer');
  } catch (err) {
    console.error('[aiService] Answer evaluation error:', err.message);
    throw err;
  }
}

/**
 * 6. Personalized Career Roadmap
 */
export async function generateRoadmapAI(currentRole, targetRole, timeframeMonths = 12) {
  try {
    const res = await api.post('/ai/roadmap', { currentRole, targetRole, timeframeMonths });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to generate career progression roadmap');
  } catch (err) {
    console.error('[aiService] Roadmap generation error:', err.message);
    throw err;
  }
}

/**
 * 7. Career Analysis
 */
export async function analyzeCareerAI(profile) {
  try {
    const res = await api.post('/ai/career-analysis', { profile });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to analyze career profile');
  } catch (err) {
    console.error('[aiService] Career analysis error:', err.message);
    throw err;
  }
}

/**
 * 8. Career Recommendations
 */
export async function getRecommendationsAI(profile) {
  try {
    const res = await api.post('/ai/recommendations', { profile });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to retrieve career recommendations');
  } catch (err) {
    console.error('[aiService] Career recommendations error:', err.message);
    throw err;
  }
}

/**
 * 9. Skill-Gap Analysis
 */
export async function analyzeSkillGapAI(currentSkills = [], targetRole = 'Senior Software Engineer') {
  try {
    const res = await api.post('/ai/skill-gap', { currentSkills, targetRole });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to perform skill gap analysis');
  } catch (err) {
    console.error('[aiService] Skill gap error:', err.message);
    throw err;
  }
}

/**
 * 10. Project & Portfolio Analysis
 */
export async function analyzeProjectAI(projectData) {
  try {
    const res = await api.post('/ai/project-analysis', { projectData });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to analyze project');
  } catch (err) {
    console.error('[aiService] Project analysis error:', err.message);
    throw err;
  }
}

/**
 * 11. Job & Resume Matching
 */
export async function matchJobResumeAI(resumeText, jobDescription) {
  try {
    const res = await api.post('/ai/job-match', { resumeText, jobDescription });
    if (res.data?.data) return res.data.data;
    throw new Error(res.data?.error || 'Failed to match resume with job description');
  } catch (err) {
    console.error('[aiService] Job match error:', err.message);
    throw err;
  }
}
