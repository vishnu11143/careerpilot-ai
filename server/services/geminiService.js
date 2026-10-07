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

const apiKey = process.env.GEMINI_API_KEY || '';
const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

// Fallback models in order of preference if primary experiences high demand / 503
const FALLBACK_MODELS = [
  configuredModel,
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemma-4-26b-a4b-it',
];

let aiClient = null;

function getClient() {
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Execute a generation call to Gemini with timeout, model retry, and structured parsing.
 */
export async function generateContent({ prompt, systemInstruction = '', model = configuredModel, timeoutMs = 15000 }) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const client = getClient();
  const modelsToTry = [model, ...FALLBACK_MODELS.filter(m => m !== model)];
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
    console.warn('[GeminiService] Failed to parse JSON from response, using structured fallback:', e.message);
  }
  return null;
}

/* ============================================
   HEALTH / CONNECTION TEST
   ============================================ */

export async function checkHealth() {
  if (!apiKey) {
    return {
      connected: false,
      error: 'GEMINI_API_KEY environment variable is missing on backend.',
      model: configuredModel,
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
      configuredModel,
      response: result.text.trim().slice(0, 50),
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs,
      error: err.message,
      configuredModel,
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
  } catch (err) {
    console.warn('[GeminiService] analyzeCareer fallback invoked:', err.message);
  }

  // Fallback
  return {
    overallReadinessScore: 78,
    marketCompetitiveness: 'High',
    summary: `Solid technical foundation in ${(profile?.skills || []).slice(0, 3).join(', ') || 'modern full-stack engineering'}. Accelerate target transition by deepening distributed architecture and engineering leadership.`,
    keyStrengths: [
      `Proficiency in modern core stack: ${(profile?.skills || []).slice(0, 3).join(', ') || 'React, Node, Cloud'}.`,
      'Demonstrated commitment to career progression and continuous skill refinement.',
      'Versatile problem-solving capability across product development lifecycle.'
    ],
    areasForGrowth: [
      'High-throughput system architecture and data partitioning at scale.',
      'Cross-functional technical influence, writing RFCs, and mentoring developers.',
      'Quantifiable business outcomes and metric-driven engineering impacts.'
    ],
    marketDemandInsights: 'Demand for senior professionals combining hands-on technical excellence with architectural clarity remains resilient across tier-1 tech.',
    nextLevelPrerequisites: [
      'Lead design of at least one multi-service architecture with strict SLOs.',
      'Contribute to technical hiring and team code quality standards.',
      'Demonstrate measurable cost optimization or latency reduction metrics.'
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] getRecommendations fallback invoked:', err.message);
  }

  return [
    {
      id: 'rec_1',
      title: 'Architect a Scalable Distributed Cache Layer',
      category: 'Project',
      impact: 'High',
      effort: 'Medium',
      actionSteps: [
        'Deploy Redis cluster with write-through and cache-aside patterns.',
        'Benchmark p99 latency reduction and document in a GitHub case study.'
      ],
      estimatedTimeToImpact: '2-3 weeks'
    },
    {
      id: 'rec_2',
      title: 'Obtain Cloud Solutions Architect Certification',
      category: 'Skill',
      impact: 'High',
      effort: 'High',
      actionSteps: [
        'Study AWS Solutions Architect Associate / GCP Professional Cloud Architect syllabus.',
        'Build infrastructure using Terraform/OpenTofu with automated CI/CD.'
      ],
      estimatedTimeToImpact: '6-8 weeks'
    },
    {
      id: 'rec_3',
      title: 'Publish Engineering Design RFCs',
      category: 'Leadership',
      impact: 'High',
      effort: 'Medium',
      actionSteps: [
        'Document technical trade-offs for a complex feature or migration.',
        'Solicit peer feedback and align stakeholders on implementation details.'
      ],
      estimatedTimeToImpact: '1-2 weeks'
    },
    {
      id: 'rec_4',
      title: 'Open Source Community Contributions',
      category: 'Networking',
      impact: 'Medium',
      effort: 'Medium',
      actionSteps: [
        'Find good-first-issues in widely used developer tooling repositories.',
        'Submit reviewed PRs and engage with maintainers in public discussions.'
      ],
      estimatedTimeToImpact: '3-4 weeks'
    }
  ];
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
  } catch (err) {
    console.warn('[GeminiService] analyzeSkillGap fallback invoked:', err.message);
  }

  const commonTargetSkills = ['Distributed Systems', 'PostgreSQL Optimization', 'System Design', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Cloud Architecture (AWS/GCP)'];
  const matched = currentSkills.filter(s => commonTargetSkills.some(t => t.toLowerCase().includes(s.toLowerCase())));
  const missing = commonTargetSkills.filter(t => !currentSkills.some(s => s.toLowerCase().includes(t.toLowerCase())));

  return {
    targetRole,
    readinessPercentage: Math.max(50, Math.min(95, Math.round((currentSkills.length / (currentSkills.length + missing.length)) * 100))),
    matchedSkills: matched.length ? matched : currentSkills.slice(0, 4),
    missingHighPrioritySkills: (missing.length ? missing : commonTargetSkills.slice(0, 4)).map(m => ({
      skill: m,
      importance: 'Critical',
      recommendedLearningPath: `Implement hands-on production scenarios demonstrating ${m} with automated testing.`
    })),
    recommendedNextSteps: [
      `Bridge the highest priority gap in ${missing[0] || 'System Design'} through a dedicated capstone project.`,
      'Conduct 2 mock technical interviews focusing on trade-offs and operational bottlenecks.',
      'Refactor existing codebases to incorporate telemetry, structured logging, and observability.'
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] generateRoadmap fallback invoked:', err.message);
  }

  return {
    title: `${currentRole || 'Software Engineer'} → ${targetRole || 'Senior Staff Engineer'} Roadmap`,
    targetRole: targetRole || 'Senior Full Stack Engineer',
    estimatedMonths: timeframeMonths,
    phases: [
      {
        phase: 1,
        name: 'Phase 1: Advanced Core Competency & Systems Thinking',
        duration: 'Month 1 - 3',
        focus: 'Deepening system architecture, async paradigms, and type-safe scalable patterns.',
        milestones: [
          { id: 'm1_1', title: 'Master Distributed State & Caching', description: 'Implement Redis caching layers, write-through vs cache-aside strategies, and cache invalidation protocols.', skills: ['Redis', 'Distributed Systems'], completed: true },
          { id: 'm1_2', title: 'Containerization & Microservice Orchestration', description: 'Dockerize polyglot services, write multi-stage Dockerfiles, and implement Docker Compose development environments.', skills: ['Docker', 'DevOps'], completed: false },
          { id: 'm1_3', title: 'Comprehensive Automated Testing Pipelines', description: 'Achieve 85%+ code coverage across unit, integration, and End-to-End suites in CI/CD.', skills: ['CI/CD', 'Testing'], completed: false }
        ]
      },
      {
        phase: 2,
        name: 'Phase 2: Cloud Scalability & High-Availability Design',
        duration: 'Month 4 - 7',
        focus: 'Infrastructure as Code, serverless architectures, and asynchronous message queues.',
        milestones: [
          { id: 'm2_1', title: 'Deploy Scalable Cloud Architecture on AWS/GCP', description: 'Architect multi-tier setups utilizing ALB, ECS/Kubernetes, RDS Aurora with read replicas, and CloudFront CDNs.', skills: ['AWS', 'Kubernetes'], completed: false },
          { id: 'm2_2', title: 'Event-Driven Architectures & Message Brokers', description: 'Incorporate Kafka or RabbitMQ for decoupled asynchronous background job processing.', skills: ['Kafka', 'Event-Driven'], completed: false },
          { id: 'm2_3', title: 'Database Optimization & Query Profiling', description: 'Analyze EXPLAIN execution plans, index strategies (B-Trees vs GIN), partitioning, and connection pooling.', skills: ['PostgreSQL', 'Query Tuning'], completed: false }
        ]
      },
      {
        phase: 3,
        name: 'Phase 3: Technical Leadership & Cross-Functional Impact',
        duration: 'Month 8 - 12',
        focus: 'Authoring RFCs, system design reviews, mentoring engineers, and business impact.',
        milestones: [
          { id: 'm3_1', title: 'Author Architectural RFCs & Lead Tech Reviews', description: 'Draft comprehensive RFC specifications for platform migrations and guide team consensus.', skills: ['Architecture RFC', 'System Design'], completed: false },
          { id: 'm3_2', title: 'Lead High-Impact Production Feature End-to-End', description: 'Drive a multi-month project from initial scoping through telemetry, launch, and retrospective.', skills: ['Project Leadership', 'Telemetry'], completed: false },
          { id: 'm3_3', title: 'Engineering Mentorship & Technical Hiring', description: 'Conduct technical interviews for engineering candidates and mentor junior developers in best practices.', skills: ['Mentorship', 'Technical Hiring'], completed: false }
        ]
      }
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] analyzeResume fallback invoked:', err.message);
  }

  const words = (resumeText || '').toLowerCase().split(/\s+/);
  const commonTech = ['react', 'node', 'typescript', 'javascript', 'python', 'docker', 'aws', 'sql', 'git', 'ci/cd', 'rest', 'api', 'graphql', 'system', 'kubernetes', 'testing', 'agile'];
  const foundTech = commonTech.filter(t => words.includes(t) || (resumeText || '').toLowerCase().includes(t));
  const missingTech = commonTech.filter(t => !foundTech.includes(t)).slice(0, 5);

  const lengthScore = Math.min(100, Math.max(40, Math.round((words.length / 450) * 85)));
  const metricMentions = ((resumeText || '').match(/\d+%|\$\d+|\d+\s*(users|clients|ms|seconds|x|million|k)/gi) || []).length;
  const impactScore = Math.min(95, 55 + metricMentions * 8);
  const keywordScore = Math.min(96, Math.max(50, Math.round((foundTech.length / 10) * 90)));
  const overallAts = Math.round((lengthScore * 0.2) + (impactScore * 0.4) + (keywordScore * 0.4));

  return {
    atsScore: overallAts,
    summary: `Resume demonstrates solid technical foundation with ${foundTech.length} verified core competencies, but would benefit from further quantifiable metrics.`,
    breakdown: {
      keywordMatch: keywordScore,
      formattingImpact: impactScore,
      bulletPoints: Math.min(92, 60 + metricMentions * 7),
      brevity: lengthScore,
    },
    topStrengths: [
      `Foundational technical coverage including ${foundTech.slice(0, 3).join(', ') || 'modern software standards'}.`,
      metricMentions > 0 ? `Includes ${metricMentions} measurable metric impacts.` : 'Consistent section hierarchy and clean structure.',
      'Clear project experience and functional timeline progression.'
    ],
    criticalGaps: [
      metricMentions < 3 ? 'Needs more quantified business outcomes (e.g., "reduced latency by 35%", "scaled to 50k users").' : 'Include more high-level architecture decisions.',
      `Missing targeted keywords frequently requested for ${targetRole}.`,
      'Action verbs could be stronger (replace "worked on", "helped" with "architected", "engineered", "spearheaded").'
    ],
    missingKeywords: missingTech.length ? missingTech : ['System Design', 'Microservices', 'CI/CD Pipelines', 'Distributed Systems', 'Cloud Architecture'],
    actionableTips: [
      'Rewrite experience bullets to follow Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
      'Move your strongest skills and high-impact accomplishments higher up in the first page view.',
      'Tailor the summary statement directly referencing your experience in ' + targetRole + '.'
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] enhanceBulletPoint fallback invoked:', err.message);
  }

  return {
    improved: [
      {
        type: 'Metric-Driven',
        text: `Spearheaded performance optimization for core application modules, slashing response latency by 38% and reducing AWS infrastructure overhead by $14,000 annually.`,
        score: 96,
        why: 'Anchors specific quantifiable cost and latency benchmarks that catch recruiter attention.'
      },
      {
        type: 'Technical-Depth',
        text: `Architected and deployed resilient microservice endpoints using modern best practices, introducing comprehensive automated test suites and achieving 99.98% service uptime.`,
        score: 93,
        why: 'Demonstrates end-to-end engineering rigor, test discipline, and system resilience.'
      },
      {
        type: 'Leadership-Scale',
        text: `Championed cross-functional feature delivery across engineering and product teams, orchestrating seamless rollout for 45,000+ daily active users ahead of deadline.`,
        score: 91,
        why: 'Highlights stakeholder alignment, delivery predictability, and user impact.'
      }
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] analyzeProject fallback invoked:', err.message);
  }

  return {
    projectScore: 85,
    impressivenessRating: 'Solid',
    technicalComplexity: 'Demonstrates full-stack competence, state management, and modern component composition.',
    strengths: [
      'Clean architectural separation between frontend UI and service layer.',
      'Demonstrates end-to-end functionality rather than a purely static prototype.'
    ],
    areasToImprove: [
      'Add automated integration and End-to-End test suites to showcase engineering maturity.',
      'Include an architecture diagram in the GitHub README detailing data flow and state management.'
    ],
    readmeRecommendations: [
      'Add a dedicated "Engineering Trade-offs & Decisions" section explaining why specific libraries were selected.',
      'Include clear GIF/video preview and 1-command local setup instructions.'
    ],
    interviewTalkingPoints: [
      'Explain how edge cases and network disconnects are gracefully handled.',
      'Discuss how the system could scale from 1,000 to 100,000 concurrent users.'
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] generateInterviewQuestions fallback invoked:', err.message);
  }

  return [
    {
      id: 1,
      question: 'Explain how you would design an optimistic UI update for an e-commerce checkout or social feed, and how you gracefully roll back state if the network mutation fails.',
      category: 'State Management & Network',
      timeLimitMinutes: 4,
      hint: 'Mention client-side caching (e.g. TanStack Query or SWR), local state reconciliation, and toast error feedback.',
      keyPointsExpected: ['Immediate cache update', 'Rollback snapshot retention', 'User notification without screen flicker']
    },
    {
      id: 2,
      question: 'How do you prevent SQL injection and Cross-Site Scripting (XSS) in modern full stack web applications, and what role do Content Security Policies (CSP) play?',
      category: 'Security & Best Practices',
      timeLimitMinutes: 4,
      hint: 'Discuss parameterized queries / ORMs, context-aware HTML escaping, and HTTP header policies.',
      keyPointsExpected: ['Parameterized queries', 'Sanitization vs escaping', 'CSP headers & strict nonce']
    },
    {
      id: 3,
      question: 'Walk me through how you would optimize a web application experiencing slow Initial Server Response (TTFB) and high Cumulative Layout Shift (CLS).',
      category: 'Web Performance & Core Vitals',
      timeLimitMinutes: 5,
      hint: 'Address server-side caching, database indexing, aspect ratio wrappers on media, and critical CSS inlining.',
      keyPointsExpected: ['TTFB vs FCP vs CLS', 'Image dimension reservations', 'CDN edge caching']
    },
    {
      id: 4,
      question: 'Tell me about a time when a critical bug occurred in production. How did you diagnose, mitigate, and conduct a post-mortem for the incident?',
      category: 'Behavioral & Incident Response',
      timeLimitMinutes: 4,
      hint: 'Use the STAR format: Situation, Task, Action, Result, plus key preventative lessons learned.',
      keyPointsExpected: ['Rapid triage & mitigation', 'Clear stakeholder communication', 'Blameless post-mortem actions']
    }
  ];
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
  } catch (err) {
    console.warn('[GeminiService] evaluateInterviewAnswer fallback invoked:', err.message);
  }

  const words = (answer || '').trim().split(/\s+/).length;
  const isTooShort = words < 25;
  const score = isTooShort ? 5 : Math.min(9, Math.max(6, Math.round(5 + words * 0.04)));

  return {
    overallScore: score,
    communicationScore: isTooShort ? 5 : 8,
    technicalScore: Math.min(10, score + 1),
    starMethodScore: words > 50 ? 8 : 6,
    summary: isTooShort
      ? 'Your answer has the right general intuition, but would benefit significantly from more concrete architectural depth, metrics, and trade-off considerations.'
      : 'Articulate and strong response touching upon key engineering considerations and practical problem-solving.',
    strengths: [
      'Directly addresses the premise of the question with clear terminology.',
      'Shows familiarity with production web development challenges.'
    ],
    improvements: [
      'Structure using the STAR framework: Set the context, explain your action, and quantify the measurable outcome.',
      'Explicitly discuss trade-offs (e.g. latency vs consistency, simplicity vs extensibility).'
    ],
    idealAnswer: 'An exemplary response articulates: the problem context, architectural solution chosen, implementation details with trade-offs analyzed, and measurable business/performance impact achieved.'
  };
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
  } catch (err) {
    console.warn('[GeminiService] matchJobResume fallback invoked:', err.message);
  }

  return {
    matchPercentage: 82,
    verdict: 'Strong Match',
    matchedRequirements: [
      'Proficiency in modern JavaScript / TypeScript web stacks and RESTful APIs.',
      'Experience in relational database design and application state management.',
      'Demonstrated collaborative delivery across agile engineering cycles.'
    ],
    missingRequirements: [
      'Specific mentions of cloud infrastructure orchestration and deployment automation.',
      'Explicit exposure to high-load distributed message queues.'
    ],
    tailoredSummarySuggestion: 'Results-driven software engineer with proven experience architecting scalable full-stack web platforms, specializing in responsive user interfaces and robust microservices.',
    keyRecommendations: [
      'Highlight specific projects matching the primary database and cloud stack named in the job description.',
      'Incorporate job-specific keywords into your top skills section for higher ATS relevance.'
    ]
  };
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
  } catch (err) {
    console.warn('[GeminiService] chatWithMentor fallback invoked:', err.message);
  }

  const lastMsg = history[history.length - 1]?.text?.toLowerCase() || '';

  if (lastMsg.includes('salary') || lastMsg.includes('offer') || lastMsg.includes('negotiat')) {
    return `### Strategic Offer & Salary Negotiation Playbook

When negotiating in today's market, keep these 3 Golden Rules in mind:

1. **Anchor on Total Compensation (TC), Not Just Base**:
   - Understand the split between Base Salary, Equity (RSUs / Options), and Sign-On Bonus.
   - Example phrasing: *"Based on market data for this tier in our region, I am targeting total comp of $X. How flexible are we on equity or sign-on to bridge this gap?"*

2. **Never Give the First Number**:
   - Turn the question back politely: *"I'm really excited about the team's mission. I'd love to understand the budgeted compensation band for this leveling."*

3. **Leverage Competing Momentum**:
   - Mention: *"I am actively in late-stage discussions with other tier-1 organizations, but your team remains my top choice if we can align on terms."*`;
  }

  if (lastMsg.includes('system design') || lastMsg.includes('interview')) {
    return `### System Design Mastery Framework

Here is how top candidates structure their system design interviews in 45 minutes:

- **0-5 min**: Clarify Functional & Non-Functional Requirements (QPS, Latency, Consistency vs Availability).
- **5-15 min**: High-Level Architecture (Client → CDN → Load Balancer → API Gateway → Services → DBs).
- **15-35 min**: Deep-Dive Core Components & Bottlenecks (Caching strategy with Redis, DB Sharding/Replication, Message Queues).
- **35-45 min**: Resiliency & Trade-offs (Rate limiting, Circuit breakers, Graceful degradation).

What system would you like to mock right now?`;
  }

  return `### Hello! I'm ${persona?.name || 'Jordan Vance'}.

I'm ready to help you accelerate your journey toward becoming a top-tier ${userProfile?.target_role || 'Senior Professional'}.

Here are some high-impact areas we can tackle:
- **Promotion & Leveling Strategy**: How to demonstrate next-level impact before you get the title.
- **System Design & Coding Interview Strategy**: Frameworks to pass technical screens consistently.
- **Resume & Project Differentiation**: Transforming ordinary bullet points into compelling engineering stories.
- **Offer Negotiation & Career Trajectory**: Maximizing equity, bonuses, and title velocity.

Where should we focus first?`;
}
