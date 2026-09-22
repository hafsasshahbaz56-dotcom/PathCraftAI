import React from 'react';
import { ArrowRight, Bot, Target, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NextBestActionCard({ action, onAction, onAskCoach }) {
  if (!action) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(262, 83%, 58%) 100%)',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem 2.25rem',
      color: 'white',
      boxShadow: '0 12px 30px -4px rgba(37, 99, 235, 0.35)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '2rem'
    }}>
      {/* Decorative backdrop glow circles */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.12)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '20%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Eyebrow Label */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.85rem'
        }}>
          <Target size={14} />
          <span>Next Best Action</span>
        </div>

        {/* Action Title */}
        <h3 style={{
          fontSize: '1.65rem',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          lineHeight: 1.25,
          marginBottom: '0.65rem',
          color: 'white'
        }}>
          {action.title}
        </h3>

        {/* Action Description */}
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '650px',
          lineHeight: 1.5,
          marginBottom: '1.5rem'
        }}>
          {action.description}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onAction}
            className="btn btn-lg"
            style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
            }}
          >
            <span>{action.ctaText || 'Take Action Now'}</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onAskCoach}
            className="btn btn-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: 'white',
              backdropFilter: 'blur(6px)'
            }}
          >
            <Bot size={18} />
            <span>Ask AI Coach Why</span>
          </button>
        </div>
      </div>
    </div>
  );
}
