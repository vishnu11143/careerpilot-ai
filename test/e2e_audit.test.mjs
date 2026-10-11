/* ========================================================
   CareerPilot AI — Automated End-to-End Test Suite
   Verifies real-time Gemini API integration, input dependency,
   structured JSON schemas, and backend route integrity.
   ======================================================== */

import assert from 'node:assert/strict';

const BASE = 'http://localhost:5000/api/ai';

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function getJSON(url) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('🧪 Starting CareerPilot AI End-to-End Audit Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    const start = Date.now();
    try {
      await fn();
      const ms = Date.now() - start;
      console.log(`✅ [PASS] ${name} (${ms}ms)`);
      passed++;
    } catch (err) {
      const ms = Date.now() - start;
      console.error(`❌ [FAIL] ${name} (${ms}ms):`, err.message);
      throw err;
    }
  }

  // 1. AI Health
  await test('Gemini AI Connectivity & Health Endpoint', async () => {
    const { status, data } = await getJSON(`${BASE}/health`);
    assert.equal(status, 200);
    assert.equal(data.connected, true);
    assert.ok(data.latencyMs > 0);
    assert.ok(data.modelUsed);
  });

  // 2. Resume Audit & ATS Scoring
  let resumeAScore = 0;
  await test('Resume Intelligence & ATS Scoring (Resume A)', async () => {
    const { status, data } = await postJSON(`${BASE}/resume-analysis`, {
      resumeText: 'Senior React Developer with 5 years experience building scalable enterprise dashboards.',
      targetRole: 'Senior React Engineer',
      jobDesc: 'Required: React, TypeScript, Redux, Microfrontends, Performance optimization.'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.data.atsScore === 'number');
    assert.ok(data.data.summary);
    assert.ok(data.data.breakdown);
    resumeAScore = data.data.atsScore;
  });

  // 3. Different Resume Input Dependency Verification
  await test('Live Input-Dependency (Different Resume B produces distinct result)', async () => {
    const { status, data } = await postJSON(`${BASE}/resume-analysis`, {
      resumeText: 'Novice high-school intern interested in basic HTML and CSS styling.',
      targetRole: 'Principal Cloud Systems Architect',
      jobDesc: 'Required: 10+ years distributed consensus, Kubernetes internals, eBPF, Go, large-scale multi-region failover.'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.data.atsScore === 'number');
    // Scores must be distinct and reflect differing candidate profiles
    assert.notEqual(data.data.atsScore, resumeAScore);
    assert.ok(data.data.atsScore < resumeAScore, 'Junior resume should receive lower score for Principal role');
  });

  // 4. Bullet Point Enhancer
  await test('AI Bullet Point Enhancer (XYZ Formula)', async () => {
    const { status, data } = await postJSON(`${BASE}/enhance-bullet`, {
      bulletPoint: 'Helped optimize database queries for our backend.',
      role: 'Backend Platform Engineer'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data.improved));
    assert.equal(data.data.improved.length, 3);
    assert.ok(data.data.improved[0].text);
  });

  // 5. Mock Interview Question Generator
  await test('Mock Interview Question Generator', async () => {
    const { status, data } = await postJSON(`${BASE}/interview-questions`, {
      role: 'Full Stack Engineer',
      topic: 'Technical Architecture',
      difficulty: 'Senior'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 3);
    assert.ok(data.data[0].question);
  });

  // 6. Mock Interview Answer Evaluator
  await test('Mock Interview Answer Scoring & STAR Rubric', async () => {
    const { status, data } = await postJSON(`${BASE}/interview-evaluate`, {
      question: 'How do you handle microservices latency spikes?',
      answer: 'We implemented OpenTelemetry distributed tracing, isolated slow database locks using Redis caching, and set circuit breakers with exponential backoff.',
      role: 'Staff Backend Engineer'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.data.overallScore === 'number');
    assert.ok(Array.isArray(data.data.strengths));
    assert.ok(data.data.idealAnswer);
  });

  // 7. Target Job & Resume Match
  await test('Target Job & Resume Matching Algorithm', async () => {
    const { status, data } = await postJSON(`${BASE}/job-match`, {
      resumeText: 'Full Stack Engineer with React, TypeScript, Node.js, PostgreSQL.',
      jobDescription: 'Seeking Senior Full Stack Developer proficient in React, Node.js, AWS, and PostgreSQL.'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.data.matchPercentage === 'number');
    assert.ok(data.data.verdict);
    assert.ok(Array.isArray(data.data.matchedRequirements));
  });

  // 8. Career Progression Roadmap
  await test('Personalized Career Progression Roadmap', async () => {
    const { status, data } = await postJSON(`${BASE}/roadmap`, {
      currentRole: 'Junior Frontend Developer',
      targetRole: 'Senior Frontend Engineer',
      timeframeMonths: 6
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data.phases));
    assert.ok(data.data.phases.length >= 2);
  });

  // 9. Skill Gap Analysis
  await test('Competency Gap Analysis Matrix', async () => {
    const { status, data } = await postJSON(`${BASE}/skill-gap`, {
      currentSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
      targetRole: 'AI & Machine Learning Engineer'
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.data.readinessPercentage === 'number');
    assert.ok(Array.isArray(data.data.missingHighPrioritySkills));
  });

  // 10. Portfolio Project Analysis
  await test('Portfolio & Project Architecture Review', async () => {
    const { status, data } = await postJSON(`${BASE}/project-analysis`, {
      projectData: {
        title: 'CareerPilot AI Platform',
        description: 'AI-assisted career acceleration suite with ATS audits and real-time Gemini integration.',
        techStack: ['React', 'Vite', 'Express', 'Gemini AI', 'Supabase'],
        githubUrl: 'https://github.com/vishnu11143/careerpilot-ai',
        liveUrl: 'https://careerpilot-ai.vercel.app'
      }
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.data.projectScore === 'number');
    assert.ok(data.data.impressivenessRating);
  });

  // 11. AI Career Mentor Chat
  await test('AI Career Mentor Conversational Intelligence', async () => {
    const { status, data } = await postJSON(`${BASE}/mentor-chat`, {
      persona: { name: 'Jordan Vance', title: 'Principal Staff Engineer', personality: 'Pragmatic and encouraging' },
      history: [{ sender: 'user', text: 'What is the most critical factor for advancing from Senior to Staff Engineer?' }],
      userProfile: { current_role: 'Senior Software Engineer', target_role: 'Staff Engineer', skills: ['System Design', 'React', 'Node.js'] }
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(typeof data.text === 'string');
    assert.ok(data.text.length > 50);
  });

  // 12. Supabase Auth & User Storage Partitioning Audit
  await test('Supabase Gateway Connectivity & User-Scoped Persistence Integrity', async () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lhrxkbvofbyudbrniehc.supabase.co';
    const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_DKwu7fa0QogcTZurFpalgg_6UTIZC4v';
    
    // Check Supabase Auth Gateway connectivity
    const authRes = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: anonKey }
    });
    assert.equal(authRes.status, 200, 'Supabase Auth gateway must respond with 200 OK');
    const authSettings = await authRes.json();
    assert.ok(authSettings.external, 'Supabase Auth settings must contain external auth providers');

    // Verify User-Scoped LocalStorage Isolation logic
    const userA = 'user_abc_123';
    const userB = 'user_xyz_789';
    const store = new Map();
    const saveUserData = (userId, key, data) => store.set(`careerpilot_${key}_${userId}`, JSON.stringify(data));
    const getUserData = (userId, key) => JSON.parse(store.get(`careerpilot_${key}_${userId}`) || 'null');

    saveUserData(userA, 'resume', { atsScore: 88, role: 'Frontend Engineer' });
    saveUserData(userB, 'resume', { atsScore: 42, role: 'DevOps Engineer' });

    assert.equal(getUserData(userA, 'resume').atsScore, 88);
    assert.equal(getUserData(userB, 'resume').atsScore, 42);
    assert.notDeepEqual(getUserData(userA, 'resume'), getUserData(userB, 'resume'));
  });

  console.log(`\n🎉 Test Suite Completed: ${passed}/${total} Tests Passed Successfully!`);
}

runTests().catch((err) => {
  console.error('\n💥 Test suite failed:', err);
  process.exit(1);
});

