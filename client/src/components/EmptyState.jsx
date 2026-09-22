import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction
}) {
  return (
    <div style={{
      background: 'white',
      border: '1px dashed var(--border-light)',
      borderRadius: 'var(--radius-xl)',
      padding: '3.5rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'var(--primary-subtle)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <Icon size={28} />
      </div>

      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
        {title}
      </h4>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '480px', marginBottom: '1.5rem' }}>
        {description}
      </p>

      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          <span>{actionText}</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
