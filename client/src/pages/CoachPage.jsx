import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, Clock, Compass, Crown, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CoachPage({ onOpenProModal }) {
  const { user, isPro } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [proGateActive, setProGateActive] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'What should I do next?',
    'I only have 5 hours this week. What should I focus on?',
    'How do I explain my active project on LinkedIn?',
    'Why was this specific career direction recommended for me?'
  ];

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get('/coach/history');
        if (res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        } else {
          // Welcome greeting
          setMessages([
            {
              role: 'assistant',
              message: `Hello ${user?.name || 'there'}! I am your dedicated AI Career Coach. I have your complete Career DNA, 30-day roadmap sprint, and portfolio project context loaded. How can I help guide your next move today?`
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput('');
    const newMsg = { role: 'user', message: text };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await api.post('/coach/chat', { message: text });
      setMessages(prev => [...prev, { role: 'assistant', message: res.message }]);
    } catch (err) {
      if (err.data?.proGate) {
        setProGateActive(true);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            message: 'You have reached your Free tier message limit (20 messages). Upgrade to PathCraft Pro for unlimited 24/7 contextual career coaching.'
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            message: "I couldn't process your request right now. Please try again in a moment."
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Context Grounding Notice */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={15} color="var(--primary)" />
          <span>Grounded with your live Career DNA, Roadmap Sprint, and Project state.</span>
        </div>
        {!isPro && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            Free Tier &bull; 20 Messages
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'flex-start',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {!isUser && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                }}>
                  <Bot size={18} />
                </div>
              )}

              <div style={{
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--radius-lg)',
                background: isUser ? 'var(--primary)' : 'var(--bg-app)',
                color: isUser ? 'white' : 'var(--text-main)',
                fontSize: '0.925rem',
                lineHeight: 1.55,
                border: isUser ? 'none' : '1px solid var(--border-light)',
                whiteSpace: 'pre-line'
              }}>
                {msg.message}
              </div>

              {isUser && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--text-main)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} />
            </div>
            <div style={{
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              Synthesizing actionable advice...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        padding: '0.75rem 0.25rem 0.5rem',
        scrollbarWidth: 'none'
      }}>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading || proGateActive}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'white',
              border: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-main)'; }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '0.5rem 0 1rem'
        }}
      >
        <input
          type="text"
          className="input-field"
          placeholder="Ask your coach: 'What should I do next?' or 'I have 5 hours this week...'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || proGateActive}
          style={{ height: '48px', fontSize: '0.95rem' }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || proGateActive}
          className="btn btn-primary"
          style={{ height: '48px', padding: '0 1.5rem' }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
