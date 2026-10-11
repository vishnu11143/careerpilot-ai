/* ============================================
   CareerPilot AI — Mock Interview Coach Page
   Interactive multi-role interview simulator with
   timer, AI answer grading, rubric, and ideal answer.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  MessageSquare, Play, RotateCcw, CheckCircle,
  HelpCircle, Clock, AlertCircle,
  Award, Sparkles, ArrowRight
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';
import { generateInterviewQuestionsAI, evaluateInterviewAnswerAI, hasGeminiApiKey } from '../../services/aiService';
import toast from 'react-hot-toast';
import './DashboardPages.css';

const ROLES = ['Full Stack Engineer', 'Frontend Engineer', 'Backend Engineer', 'DevOps / Cloud', 'System Design'];
const DIFFICULTIES = ['Junior', 'Mid-Level', 'Senior', 'Staff / Lead'];
const TOPICS = ['Technical Architecture', 'Core Principles & Best Practices', 'Behavioral (STAR)', 'Web Performance'];

export default function MockInterviewPage() {
  const [selectedRole, setSelectedRole] = useState('Full Stack Engineer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Senior');
  const [selectedTopic, setSelectedTopic] = useState('Technical Architecture');

  // Interview session state
  const [inSession, setInSession] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Evaluation state
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const startInterview = async () => {
    setEvaluating(true);
    try {
      const qList = await generateInterviewQuestionsAI(selectedRole, selectedTopic, selectedDifficulty);
      setQuestions(qList);
      setCurrentIndex(0);
      setUserAnswer('');
      setCurrentEvaluation(null);
      setShowHint(false);
      setSecondsElapsed(0);
      setTimerRunning(true);
      setInSession(true);
    } catch (err) {
      console.error('Failed to start interview:', err);
      toast.error(err.message || 'Failed to generate interview questions.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setTimerRunning(false);
    setEvaluating(true);
    try {
      const currentQ = questions[currentIndex];
      const evalResult = await evaluateInterviewAnswerAI(currentQ.question, userAnswer, selectedRole);
      setCurrentEvaluation(evalResult);
    } catch (err) {
      console.error('Evaluation failed:', err);
      toast.error(err.message || 'Failed to evaluate interview answer.');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setCurrentEvaluation(null);
      setShowHint(false);
      setSecondsElapsed(0);
      setTimerRunning(true);
    } else {
      // Finished all questions
      setInSession(false);
      setTimerRunning(false);
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <MessageSquare size={30} style={{ color: 'hsl(152, 68%, 40%)' }} />
            Mock Interview Coach
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Simulate realistic technical and behavioral interviews with instant AI scoring & ideal answers.
          </p>
        </div>
        <Badge variant={hasGeminiApiKey() ? 'success' : 'primary'}>
          {hasGeminiApiKey() ? '⚡ Gemini 1.5 Active' : '✨ Built-in Interview Engine'}
        </Badge>
      </div>

      {!inSession ? (
        /* Configuration Setup */
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={20} style={{ color: 'hsl(152, 68%, 40%)' }} />
              Configure Interview Session
            </h3>

            {/* Target Role */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Target Engineering Role
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedRole === role ? '2px solid hsl(152, 68%, 40%)' : '1px solid var(--border-primary)',
                      backgroundColor: selectedRole === role ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
                      color: selectedRole === role ? 'hsl(152, 68%, 35%)' : 'var(--text-secondary)',
                      fontWeight: selectedRole === role ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Seniority Level
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedDifficulty === diff ? '2px solid hsl(152, 68%, 40%)' : '1px solid var(--border-primary)',
                      backgroundColor: selectedDifficulty === diff ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
                      color: selectedDifficulty === diff ? 'hsl(152, 68%, 35%)' : 'var(--text-secondary)',
                      fontWeight: selectedDifficulty === diff ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Topic */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Focus Topic
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {TOPICS.map((top) => (
                  <button
                    key={top}
                    type="button"
                    onClick={() => setSelectedTopic(top)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedTopic === top ? '2px solid hsl(152, 68%, 40%)' : '1px solid var(--border-primary)',
                      backgroundColor: selectedTopic === top ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
                      color: selectedTopic === top ? 'hsl(152, 68%, 35%)' : 'var(--text-secondary)',
                      fontWeight: selectedTopic === top ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={evaluating}
              onClick={startInterview}
              icon={<Play size={18} />}
              style={{ backgroundColor: 'hsl(152, 68%, 40%)', borderColor: 'hsl(152, 68%, 40%)' }}
            >
              Start Practice Session (4 Questions)
            </Button>
          </Card>
        </div>
      ) : (
        /* Active Interview Simulator */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column: Question & Answer Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Badge variant="primary">Question {currentIndex + 1} of {questions.length}</Badge>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{currentQ?.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Clock size={16} />
                  <span>{formatTimer(secondsElapsed)}</span>
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                {currentQ?.question}
              </h3>

              {/* Hint toggle */}
              {currentQ?.hint && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}
                  >
                    <HelpCircle size={15} />
                    {showHint ? 'Hide Hint' : 'Need a hint on key concepts?'}
                  </button>
                  {showHint && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--color-primary)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      💡 {currentQ.hint}
                    </div>
                  )}
                </div>
              )}

              {/* User Answer Textarea */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    Your Answer (STAR approach recommended):
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    {userAnswer.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Structure your answer: Explain your reasoning, trade-offs, architecture decisions, and metrics..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="ghost"
                  onClick={() => setInSession(false)}
                  icon={<RotateCcw size={16} />}
                >
                  End Session
                </Button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button
                    variant="primary"
                    disabled={!userAnswer.trim() || evaluating}
                    loading={evaluating}
                    onClick={handleEvaluate}
                    icon={<Sparkles size={16} />}
                    style={{ backgroundColor: 'hsl(152, 68%, 40%)', borderColor: 'hsl(152, 68%, 40%)' }}
                  >
                    Submit & Grade Answer
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Grade & Ideal Answer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!currentEvaluation ? (
              <Card style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(152, 68%, 40%)', marginBottom: '1rem' }}>
                  <Award size={28} />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Awaiting Your Answer
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Take your time to type a detailed response. Once submitted, our AI Evaluator will score your communication, depth, and STAR alignment.
                </p>
              </Card>
            ) : (
              <>
                {/* Score Card */}
                <Card style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <ProgressRing
                        value={currentEvaluation.overallScore * 10}
                        size={72}
                        strokeWidth={6}
                        color="hsl(152, 68%, 40%)"
                      />
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SCORE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          {currentEvaluation.overallScore} / 10
                        </div>
                      </div>
                    </div>
                    <Badge variant={currentEvaluation.overallScore >= 8 ? 'success' : currentEvaluation.overallScore >= 6 ? 'warning' : 'error'}>
                      {currentEvaluation.overallScore >= 8 ? 'Strong Hire' : currentEvaluation.overallScore >= 6 ? 'Lean Hire' : 'Needs Practice'}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {currentEvaluation.summary}
                  </p>

                  {/* Dimension bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-primary)', paddingTop: '0.75rem' }}>
                    {[
                      { label: 'Technical Accuracy & Depth', score: currentEvaluation.technicalScore },
                      { label: 'Communication Clarity', score: currentEvaluation.communicationScore },
                      { label: 'STAR Structure / Results', score: currentEvaluation.starMethodScore },
                    ].map((m) => (
                      <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.score}/10</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Strengths & Improvements */}
                <Card style={{ padding: '1.25rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle size={14} /> Notable Strengths
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {currentEvaluation.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(38, 92%, 50%)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <AlertCircle size={14} /> Areas for Improvement
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {currentEvaluation.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Model Ideal Answer */}
                <Card style={{ padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Award size={15} style={{ color: 'var(--color-primary)' }} />
                    Model Benchmark Answer
                  </div>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    {currentEvaluation.idealAnswer}
                  </p>
                </Card>

                {/* Next button */}
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={nextQuestion}
                  icon={<ArrowRight size={16} />}
                >
                  {currentIndex + 1 < questions.length ? 'Proceed to Next Question' : 'Complete Session'}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
