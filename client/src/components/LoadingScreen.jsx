import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, Compass } from 'lucide-react';

export default function LoadingScreen({ title = 'Synthesizing Your Career Growth Architecture' }) {
  const steps = [
    'Analyzing your career profile and answers...',
    'Synthesizing persistent Career DNA...',
    'Diagnosing priority skill gaps...',
    'Generating tailored 30-day acceleration roadmap...',
    'Curating practical portfolio projects (Learn → Build → Prove)...',
    'Formulating personal brand and LinkedIn guidance...'
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div style={{
      minHeight: '450px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center'
    }}>
      {/* Animated glowing logo */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
        marginBottom: '1.75rem'
      }} className="animate-pulse-glow">
        <Compass size={36} />
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', marginBottom: '2.5rem' }}>
        Our Gemini AI engine is connecting your background, goals, and market signals into a cohesive, actionable plan.
      </p>

      {/* Progress Checklist */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 2rem',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'left'
      }}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.65rem 0',
                borderBottom: idx !== steps.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                opacity: isDone || isCurrent ? 1 : 0.45,
                transition: 'all 0.3s ease'
              }}
            >
              {isDone ? (
                <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
              ) : isCurrent ? (
                <Loader2 size={18} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid var(--text-subtle)',
                  flexShrink: 0
                }} />
              )}
              <span style={{
                fontSize: '0.9rem',
                fontWeight: isCurrent ? 600 : 500,
                color: isCurrent ? 'var(--primary)' : (isDone ? 'var(--text-main)' : 'var(--text-muted)')
              }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
