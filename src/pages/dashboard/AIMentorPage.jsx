/* ============================================
   CareerPilot AI — AI Career Mentor Page
   Interactive multi-persona AI advisor with Gemini
   integration, memory, and actionable prompt pills.
   ============================================ */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, Send, User, Trash2, Copy, Check
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { mentorChatAI, hasGeminiApiKey } from '../../services/aiService';
import './DashboardPages.css';

const PERSONAS = [
  {
    id: 'staff-eng',
    name: 'Sarah Lin',
    title: 'Staff Software Engineer @ Big Tech',
    avatar: '👩‍💻',
    personality: 'Pragmatic, high-standards, focused on system architecture, code rigor, and L5/L6 career advancement.',
    color: 'hsl(245, 67%, 55%)',
    specialties: ['System Design', 'Promotion to Staff', 'Code Reviews', 'Technical RFCs'],
    greeting: `Hey! I'm Sarah. I've spent the last 8 years scaling distributed systems at Google and Stripe. How can I help you level up your engineering career today?`
  },
  {
    id: 'cto',
    name: 'Marcus Vance',
    title: 'Startup Founder & 2x CTO',
    avatar: '🚀',
    personality: 'Fast-paced, 80/20 execution-oriented, passionate about 0-to-1 building, product intuition, and fullstack velocity.',
    color: 'hsl(185, 70%, 42%)',
    specialties: ['Startup Culture', 'Fullstack Agility', 'Product-Led Engineering', 'Early-Stage Equity'],
    greeting: `Hi! I'm Marcus. I love building high-impact products fast. Want advice on early-stage startups, modern stack choices, or wearing multiple hats?`
  },
  {
    id: 'negotiator',
    name: 'Elena Rostova',
    title: 'Executive Recruiter & Salary Coach',
    avatar: '💼',
    personality: 'Strategic, confident, specialized in tech compensation, RSU equity valuation, and offer negotiation leverage.',
    color: 'hsl(152, 68%, 40%)',
    specialties: ['Offer Negotiation', 'Equity & RSUs', 'Recruiter Psychology', 'Executive Resumes'],
    greeting: `Welcome! I'm Elena. I've helped hundreds of engineers negotiate an average of $25k-$60k increases in total compensation. What offers or stages are you working through?`
  },
  {
    id: 'ai-lead',
    name: 'Dr. Aris Thorne',
    title: 'AI Research & MLOps Lead',
    avatar: '🤖',
    personality: 'Forward-looking, analytical, helping engineers pivot into Generative AI, LLM fine-tuning, and modern vector architectures.',
    color: 'hsl(280, 65%, 55%)',
    specialties: ['LLM Engineering', 'RAG & Vector DBs', 'AI Skill Pivot', 'PyTorch / Python'],
    greeting: `Greetings! I'm Aris. Ready to transition into AI engineering, understand modern agentic frameworks, or learn practical MLOps? Let's dive in.`
  }
];

const SUGGESTED_PROMPTS = [
  'How do I negotiate a higher total compensation package?',
  'What system design concepts are essential for Senior (L5) interviews?',
  'How do I transition from Junior to Senior engineer faster?',
  'How should I explain architectural trade-offs to non-technical stakeholders?'
];

export default function AIMentorPage() {
  const { profile } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const getStorageKey = useCallback((personaId) => {
    return profile?.id
      ? `careerpilot_mentor_${profile.id}_${personaId}`
      : `careerpilot_mentor_chat_${personaId}`;
  }, [profile?.id]);

  // Initialize or load conversation for current persona
  useEffect(() => {
    const storageKey = getStorageKey(selectedPersona.id);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {
        // Fallback
      }
    }
    // Default greeting
    setMessages([
      {
        id: 'msg-init',
        sender: 'mentor',
        text: selectedPersona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [selectedPersona, getStorageKey]);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = getStorageKey(selectedPersona.id);
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, selectedPersona, getStorageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customText) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      const replyText = await mentorChatAI(selectedPersona, newHistory, profile || {
        current_role: 'Software Engineer',
        target_role: 'Senior Software Engineer',
        skills: ['React', 'TypeScript', 'Node.js']
      });

      const mentorMsg = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      console.error('Mentor error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `mentor-err-${Date.now()}`,
          sender: 'mentor',
          text: `⚠️ AI Error: ${err.message || 'Unable to connect to AI mentor'}. Please check your connection or server environment variables.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const storageKey = getStorageKey(selectedPersona.id);
    localStorage.removeItem(storageKey);
    setMessages([
      {
        id: 'msg-init',
        sender: 'mentor',
        text: selectedPersona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <Bot size={30} style={{ color: 'var(--color-primary)' }} />
            AI Career Mentor
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Chat with world-class engineering leaders, recruiters, and compensation coaches.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Badge variant={hasGeminiApiKey() ? 'success' : 'primary'}>
            {hasGeminiApiKey() ? '⚡ Gemini 1.5 Pro' : '✨ Built-in Mentor Engine'}
          </Badge>
          <Button variant="ghost" size="sm" onClick={clearChat} icon={<Trash2 size={14} />}>
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Main Grid: Persona Picker + Chat Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Persona Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select Mentor
          </div>
          {PERSONAS.map((p) => {
            const isSelected = selectedPersona.id === p.id;
            return (
              <Card
                key={p.id}
                hoverable
                onClick={() => setSelectedPersona(p)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: isSelected ? `2px solid var(--color-primary)` : '1px solid var(--border-primary)',
                  backgroundColor: isSelected ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <div style={{ fontSize: '2rem', lineHeight: 1 }}>
                    {p.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {p.name}
                      </h3>
                      {isSelected && <Badge variant="primary" size="sm">Active</Badge>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 500, marginTop: '0.15rem' }}>
                      {p.title}
                    </div>
                    <p style={{ margin: '0.5rem 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {p.personality}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {p.specialties.map((spec) => (
                        <span
                          key={spec}
                          style={{
                            fontSize: '0.725rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Chat Window */}
        <Card style={{ display: 'flex', flexDirection: 'column', height: '680px', padding: 0, overflow: 'hidden' }}>
          {/* Chat Header */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{selectedPersona.avatar}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedPersona.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedPersona.title}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Online</span>
            </div>
          </div>

          {/* Messages Flow */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isUser ? '1rem' : '1.25rem',
                      background: isUser ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                      color: isUser ? '#fff' : 'inherit',
                      flexShrink: 0,
                    }}
                  >
                    {isUser ? <User size={18} /> : selectedPersona.avatar}
                  </div>

                  <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                    <div
                      style={{
                        padding: '0.875rem 1.125rem',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isUser ? 'var(--color-primary)' : 'var(--bg-secondary)',
                        color: isUser ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '0.925rem',
                        lineHeight: 1.6,
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {msg.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => copyMessage(msg.id, msg.text)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '2px',
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.25rem' }}>{selectedPersona.avatar}</div>
                <div style={{ padding: '0.75rem 1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner spinner-sm" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {selectedPersona.name} is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div style={{ padding: '0.5rem 1.25rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                style={{
                  fontSize: '0.785rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '0.75rem', background: 'var(--bg-card)' }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${selectedPersona.name} anything about your career...`}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || loading}
              loading={loading}
              icon={<Send size={16} />}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
