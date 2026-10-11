/* ============================================
   CareerPilot AI — Backend Gemini AI Service
   Centralized, secure Google GenAI SDK integration.
   The GEMINI_API_KEY is kept strictly on the backend.
   ============================================ */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getApiKey() {
  return process.env.GEMINI_API_KEY || '';
}

function getConfiguredModel() {
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
}

// Fallback models in order of preference if primary experiences high demand / 503
const FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemma-4-26b-a4b-it',
];

let aiClient = null;

function getClient() {
  const key = getApiKey();
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your environment variables.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

/**
 * Execute a generation call to Gemini with timeout, model retry, and structured parsing.
 */
export async function generateContent({ prompt, systemInstruction = '', model = null, timeoutMs = 25000 }) {
  const primaryModel = model || getConfiguredModel();
  const client = getClient();
  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)];
  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const fullPrompt = systemInstruction ? `${systemInstruction}\n\nTask:\n${prompt}` : prompt;
      
      const responsePromise = client.models.generateContent({
        model: currentModel,
        contents: fullPrompt,
      });

      // Timeout wrapper
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Gemini API request timed out after ${timeoutMs}ms`)), timeoutMs);
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);
      const text = response?.text || '';

      if (text) {
        return {
          text,
          modelUsed: currentModel,
        };
      }
    } catch (err) {
      lastError = err;
      const status = err.status || (err.message && err.message.includes('503') ? 503 : 0);
      console.warn(`[GeminiService] Attempt with model "${currentModel}" failed (${status || err.message}). Trying fallback...`);
      // Continue to next model
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
}

/**
 * Safe JSON extractor helper
 */
function extractJSON(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('[GeminiService] Failed to parse JSON from response:', e.message);
  }
  return null;
}

/* ============================================
   HEALTH / CONNECTION TEST
   ============================================ */

export async function checkHealth() {
  const key = getApiKey();
  const model = getConfiguredModel();
  if (!key) {
    return {
      connected: false,
      error: 'GEMINI_API_KEY environment variable is missing on backend.',
      model,
    };
  }

  const start = performance.now();
  try {
    const result = await generateContent({
      prompt: 'Respond with the word "CONNECTED" only.',
      timeoutMs: 10000,
    });
    const latencyMs = Math.round(performance.now() - start);

    return {
      connected: true,
      latencyMs,
      modelUsed: result.modelUsed,
      configuredModel: model,
      response: result.text.trim().slice(0, 50),
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs,
      error: err.message,
      configuredModel: model,
    };
  }
}

/* ============================================
   CAREER PILOT AI FEATURES
   ============================================ */

/**
 * 1. Career Analysis
 */
export async function analyzeCareer(profile) {
  const prompt = `Perform an in-depth strategic career analysis for this tech professional:
Current Role: ${profile?.current_role || 'Software Engineer'}
Target Role: ${profile?.target_role || 'Senior Software Engineer'}
Experience Level: ${profile?.experience_level || 'Mid'}
Industry: ${profile?.industry || 'Technology'}
Skills: ${(profile?.skills || []).join(', ') || 'JavaScript, React, Node.js'}
Career Goals: ${profile?.career_goals || 'Lead high-impact engineering teams'}

Return a strict JSON object with this exact structure:
{
  "overallReadinessScore": number (0-100),
  "marketCompetitiveness": "High" | "Medium" | "Developing",
  "summary": string,
  "keyStrengths": [string, string, string],
  "areasForGrowth": [string, string, string],
  "marketDemandInsights": string,
  "nextLevelPrerequisites": [string, string, string]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an executive tech career strategist and FAANG hiring director.',
    });
    const parsed = extractJSON(result.text);
    if (parsed) return parsed;
    throw new Error('Unable to parse AI career analysis response.');
  } catch (err) {
    console.error('[GeminiService] analyzeCareer error:', err);
    throw err;
  }
}

/**
 * 2. Career Recommendations
 */
export async function getRecommendations(profile) {
  const prompt = `Based on this professional profile, provide 4 high-ROI strategic career recommendations:
Current Role: ${profile?.current_role || 'Software Engineer'}
Target Role: ${profile?.target_role || 'Staff Engineer'}
Skills: ${(profile?.skills || []).join(', ') || 'Full Stack'}

Return a strict JSON array of recommendations:
[
  {
    "id": "rec_1",
    "title": string,
    "category": "Skill" | "Project" | "Networking" | "Leadership",
    "impact": "High" | "Medium",
    "effort": "Low" | "Medium" | "High",
    "actionSteps": [string, string],
    "estimatedTimeToImpact": string
  }
]`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an expert career acceleration advisor for software engineers.',
    });
    const parsed = extractJSON(result.text);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    throw new Error('Unable to parse AI career recommendations response.');
  } catch (err) {
    console.error('[GeminiService] getRecommendations error:', err);
    throw err;
  }
}

/**
 * 3. Skill-Gap Analysis
 */
export async function analyzeSkillGap(currentSkills = [], targetRole = 'Senior Software Engineer') {
  const prompt = `Conduct a rigorous skill gap analysis for transitioning to "${targetRole}".
Current skills: ${currentSkills.join(', ') || 'HTML, CSS, JavaScript, React'}

Return a strict JSON object:
{
  "targetRole": "${targetRole}",
  "readinessPercentage": number (0-100),
  "matchedSkills": [string],
  "missingHighPrioritySkills": [
    { "skill": string, "importance": "Critical" | "Important", "recommendedLearningPath": string }
  ],
  "recommendedNextSteps": [string, string, string]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are a technical talent assessor specialized in competency mapping.',
    });
    const parsed = extractJSON(result.text);
    if (parsed) return parsed;
    throw new Error('Unable to parse AI skill-gap response.');
  } catch (err) {
    console.error('[GeminiService] analyzeSkillGap error:', err);
    throw err;
  }
}

/**
 * 4. Personalized Career Roadmap
 */
export async function generateRoadmap(currentRole, targetRole, timeframeMonths = 12) {
  const prompt = `Create a comprehensive, personalized career roadmap from "${currentRole || 'Software Engineer'}" to "${targetRole || 'Senior Staff Engineer'}" spanning ${timeframeMonths} months.
Return a strict JSON object with this structure:
{
  "title": string,
  "targetRole": "${targetRole}",
  "estimatedMonths": ${timeframeMonths},
  "phases": [
    {
      "phase": number,
      "name": string,
      "duration": string,
      "focus": string,
      "milestones": [
        { "id": string, "title": string, "description": string, "skills": [string], "completed": boolean }
      ]
    }
  ]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are a career development architect for top engineering organizations.',
    });
    const parsed = extractJSON(result.text);
    if (parsed && Array.isArray(parsed.phases)) return parsed;
    throw new Error('Unable to parse AI career roadmap response.');
  } catch (err) {
    console.error('[GeminiService] generateRoadmap error:', err);
    throw err;
  }
}

/**
 * 5. Resume Analysis & ATS Scoring
 */
export async function analyzeResume(resumeText, targetRole = 'Software Engineer', jobDesc = '') {
  const prompt = `Analyze this resume for the role "${targetRole}".
Job Description: ${jobDesc || 'General industry standard'}
Resume content:
${(resumeText || '').slice(0, 4000)}

Return a strict JSON object with this exact structure:
{
  "atsScore": number (0-100),
  "summary": string,
  "breakdown": {
    "keywordMatch": number (0-100),
    "formattingImpact": number (0-100),
    "bulletPoints": number (0-100),
    "brevity": number (0-100)
  },
  "topStrengths": [string, string, string],
  "criticalGaps": [string, string, string],
  "missingKeywords": [string, string, string, string, string],
  "actionableTips": [string, string, string]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an elite Silicon Valley ATS algorithms director and executive technical recruiter.',
    });
    const parsed = extractJSON(result.text);
    if (parsed && typeof parsed.atsScore === 'number') return parsed;
    throw new Error('Unable to parse AI resume analysis response.');
  } catch (err) {
    console.error('[GeminiService] analyzeResume error:', err);
    throw err;
  }
}

/**
 * 6. Bullet Point Enhancer
 */
export async function enhanceBulletPoint(bulletPoint, role = 'Software Engineer') {
  const prompt = `Rewrite this resume bullet point for a "${role}" using the XYZ impact formula (Accomplished [X] measured by [Y] by doing [Z]).
Original bullet: "${bulletPoint}"
Provide 3 enhanced alternatives:
1. Impact & Metrics focused
2. Technical Depth & Architecture focused
3. Leadership & Ownership focused
Return strict JSON:
{
  "improved": [
    { "type": "Metric-Driven", "text": string, "score": number (0-100), "why": string },
    { "type": "Technical-Depth", "text": string, "score": number (0-100), "why": string },
    { "type": "Leadership-Scale", "text": string, "score": number (0-100), "why": string }
  ]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an executive resume writer specializing in tech talent.',
    });
    const parsed = extractJSON(result.text);
    if (parsed && Array.isArray(parsed.improved)) return parsed;
    throw new Error('Unable to parse AI bullet enhancement response.');
  } catch (err) {
    console.error('[GeminiService] enhanceBulletPoint error:', err);
    throw err;
  }
}

/**
 * 7. Project & Portfolio Analysis
 */
export async function analyzeProject(projectData) {
  const prompt = `Analyze this engineering portfolio project:
Title: ${projectData.title || 'Portfolio Project'}
Description: ${projectData.description || ''}
Tech Stack: ${(projectData.techStack || []).join(', ') || 'React, Node.js'}
GitHub URL: ${projectData.githubUrl || 'N/A'}
Live Demo: ${projectData.liveUrl || 'N/A'}

Return strict JSON:
{
  "projectScore": number (0-100),
  "impressivenessRating": "Exceptional" | "Solid" | "Needs Polish",
  "technicalComplexity": string,
  "strengths": [string, string],
  "areasToImprove": [string, string],
  "readmeRecommendations": [string, string],
  "interviewTalkingPoints": [string, string]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are a principal engineer conducting technical project reviews.',
    });
    const parsed = extractJSON(result.text);
    if (parsed) return parsed;
    throw new Error('Unable to parse AI project analysis response.');
  } catch (err) {
    console.error('[GeminiService] analyzeProject error:', err);
    throw err;
  }
}

/**
 * 8. Interview Question Generator & Evaluator
 */
export async function generateInterviewQuestions(role = 'Full Stack Engineer', topic = 'Technical', difficulty = 'Mid-Level') {
  const prompt = `Generate 4 realistic mock interview questions for a ${difficulty} ${role} focusing on ${topic}.
Return strict JSON array:
[
  {
    "id": number,
    "question": string,
    "category": string,
    "timeLimitMinutes": number,
    "hint": string,
    "keyPointsExpected": [string, string, string]
  }
]`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an interview architect for top tech companies.',
    });
    const parsed = extractJSON(result.text);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    throw new Error('Unable to parse AI interview questions response.');
  } catch (err) {
    console.error('[GeminiService] generateInterviewQuestions error:', err);
    throw err;
  }
}

export async function evaluateInterviewAnswer(question, answer, role = 'Full Stack Engineer') {
  const prompt = `Evaluate this candidate's interview answer.
Question: "${question}"
Candidate Answer: "${answer}"
Role: "${role}"

Return strict JSON:
{
  "overallScore": number (1-10),
  "communicationScore": number (1-10),
  "technicalScore": number (1-10),
  "starMethodScore": number (1-10),
  "summary": string,
  "strengths": [string, string],
  "improvements": [string, string],
  "idealAnswer": string
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are a senior tech hiring committee evaluator.',
    });
    const parsed = extractJSON(result.text);
    if (parsed && typeof parsed.overallScore === 'number') return parsed;
    throw new Error('Unable to parse AI interview evaluation response.');
  } catch (err) {
    console.error('[GeminiService] evaluateInterviewAnswer error:', err);
    throw err;
  }
}

/**
 * 9. Job & Resume Matching
 */
export async function matchJobResume(resumeText, jobDescription) {
  const prompt = `Compare this resume against the job description.
Resume:
${(resumeText || '').slice(0, 3000)}

Job Description:
${(jobDescription || '').slice(0, 3000)}

Return strict JSON:
{
  "matchPercentage": number (0-100),
  "verdict": "Strong Match" | "Moderate Match" | "Low Match",
  "matchedRequirements": [string, string, string],
  "missingRequirements": [string, string, string],
  "tailoredSummarySuggestion": string,
  "keyRecommendations": [string, string]
}`;

  try {
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an executive recruiting consultant matching candidates to requirements.',
    });
    const parsed = extractJSON(result.text);
    if (parsed && typeof parsed.matchPercentage === 'number') return parsed;
    throw new Error('Unable to parse AI job match response.');
  } catch (err) {
    console.error('[GeminiService] matchJobResume error:', err);
    throw err;
  }
}

/**
 * 10. AI Career Mentor / Assistant Chat
 */
export async function chatWithMentor(persona, history, userProfile) {
  const systemInstruction = `You are ${persona?.name || 'Jordan Vance'}, a ${persona?.title || 'Principal Staff Engineer & Career Mentor'}.
Personality: ${persona?.personality || 'Encouraging, pragmatic, deeply technical, and focused on career velocity'}.
User Context:
- Current Role: ${userProfile?.current_role || 'Aspiring Software Engineer'}
- Target Role: ${userProfile?.target_role || 'Senior Software Engineer'}
- Verified Skills: ${(userProfile?.skills || []).join(', ') || 'React, Node.js, Python'}

Provide concise, highly actionable, encouraging career guidance. Use clean Markdown formatting with clear bullet points.`;

  const conversationText = (history || []).map(m => `${(m.sender || 'user').toUpperCase()}: ${m.text || ''}`).join('\n\n');

  try {
    const result = await generateContent({
      prompt: conversationText,
      systemInstruction,
    });
    if (result.text && result.text.trim()) return result.text;
    throw new Error('Empty response from AI mentor.');
  } catch (err) {
    console.error('[GeminiService] chatWithMentor error:', err);
    throw err;
  }
}
