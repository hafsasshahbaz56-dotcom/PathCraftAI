import React from 'react';
import { Menu, Sparkles, Bot, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ viewTitle, setMobileOpen, setView, onOpenProModal }) {
  const { user, isPro } = useAuth();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            color: 'var(--text-main)'
          }}
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {viewTitle}
          </h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Ask AI quick button */}
        <button
          onClick={() => setView('coach')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', borderColor: 'var(--primary-light)' }}
        >
          <Bot size={16} />
          <span>Ask AI Coach</span>
        </button>

        {/* Subscription Pill */}
        {!isPro ? (
          <button
            onClick={onOpenProModal}
            className="badge badge-primary"
            style={{ cursor: 'pointer', padding: '0.35rem 0.75rem', border: '1px solid var(--primary-light)' }}
          >
            Free Plan &bull; <span style={{ textDecoration: 'underline' }}>Upgrade</span>
          </button>
        ) : (
          <span className="badge badge-pro" style={{ padding: '0.35rem 0.75rem' }}>
            <Crown size={12} /> PRO
          </span>
        )}

        {/* User initials circle */}
        <div
          onClick={() => setView('profile')}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(221, 83%, 53%), hsl(262, 83%, 58%))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title={user?.name || 'Profile'}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
