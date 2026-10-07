/* ============================================
   CareerPilot AI — Backend AI Router
   Exposes all Career Pilot AI endpoints.
   ============================================ */

import express from 'express';
import * as geminiService from '../services/geminiService.js';

const router = express.Router();

// 1. Health check & model connection test
router.get('/health', async (req, res) => {
  try {
    const health = await geminiService.checkHealth();
    res.json(health);
  } catch (err) {
    res.status(500).json({
      connected: false,
      error: err.message,
    });
  }
});

// 2. Career analysis
router.post('/career-analysis', async (req, res) => {
  try {
    const { profile } = req.body;
    const data = await geminiService.analyzeCareer(profile);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Career recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { profile } = req.body;
    const data = await geminiService.getRecommendations(profile);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Skill-gap analysis
router.post('/skill-gap', async (req, res) => {
  try {
    const { currentSkills, targetRole } = req.body;
    const data = await geminiService.analyzeSkillGap(currentSkills, targetRole);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Personalized career roadmap
router.post('/roadmap', async (req, res) => {
  try {
    const { currentRole, targetRole, timeframeMonths } = req.body;
    const data = await geminiService.generateRoadmap(currentRole, targetRole, timeframeMonths);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Resume analysis
router.post('/resume-analysis', async (req, res) => {
  try {
    const { resumeText, targetRole, jobDesc } = req.body;
    const data = await geminiService.analyzeResume(resumeText, targetRole, jobDesc);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Enhance bullet point
router.post('/enhance-bullet', async (req, res) => {
  try {
    const { bulletPoint, role } = req.body;
    const data = await geminiService.enhanceBulletPoint(bulletPoint, role);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Project & portfolio analysis
router.post('/project-analysis', async (req, res) => {
  try {
    const { projectData } = req.body;
    const data = await geminiService.analyzeProject(projectData);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Interview question generator
router.post('/interview-questions', async (req, res) => {
  try {
    const { role, topic, difficulty } = req.body;
    const data = await geminiService.generateInterviewQuestions(role, topic, difficulty);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Interview answer evaluator
router.post('/interview-evaluate', async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    const data = await geminiService.evaluateInterviewAnswer(question, answer, role);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Job & resume matching
router.post('/job-match', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const data = await geminiService.matchJobResume(resumeText, jobDescription);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. AI Career Mentor Chat
router.post('/mentor-chat', async (req, res) => {
  try {
    const { persona, history, userProfile } = req.body;
    const text = await geminiService.chatWithMentor(persona, history, userProfile);
    res.json({ success: true, text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
