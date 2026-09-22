import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProGateModal({ isOpen, onClose }) {
  const { isPro, updateSubscription } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleTogglePlan = async (newStatus) => {
    setUpdating(true);
    setMsg('');
    try {
      await updateSubscription(newStatus);
      setMsg(`Account successfully switched to ${newStatus.toUpperCase()} tier.`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      setMsg('Failed to update subscription status: ' + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const proFeatures = [
    'Complete Career DNA Diagnostic & Market Alignment',
    'Full 30, 60 & 90-Day Tailored Acceleration Roadmaps',
    'Unlimited Portfolio Project Blueprints & Step-by-Step Guides',
    'Advanced Skill Benchmarking & Industry Salary Data',
    'Complete Personal Brand Gap Analysis & Recommendations',
    'Full AI-Generated LinkedIn Headlines, About & Content Calendar',
    'Unlimited 24/7 Context-Aware AI Career Coaching',
    'Priority Model Access & Instant Re-synthesis'
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 100
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '680px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-light)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.5rem'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(221, 83%, 53%))',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
            marginBottom: '1rem'
          }}>
            <Crown size={28} />
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Elevate Your Career with PathCraft Pro
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
            Unlock comprehensive roadmaps, enterprise capstones, full personal brand assets, and unlimited coaching.
          </p>

          {/* Pricing Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-app)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-full)',
            marginTop: '1.25rem',
            border: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                border: 'none',
                background: billingCycle === 'monthly' ? 'white' : 'transparent',
                color: billingCycle === 'monthly' ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: billingCycle === 'monthly' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer'
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                border: 'none',
                background: billingCycle === 'yearly' ? 'white' : 'transparent',
                color: billingCycle === 'yearly' ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: billingCycle === 'yearly' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer'
              }}
            >
              Yearly (Save 15%)
            </button>
          </div>
        </div>

        {/* Price Box */}
        <div style={{
          background: 'linear-gradient(180deg, hsl(221, 95%, 98%) 0%, #ffffff 100%)',
          border: '1px solid hsl(221, 83%, 85%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
              {billingCycle === 'monthly' ? '$19' : '$199'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
              USD / {billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
            Primary billing currency: USD ($). Supports all major international payment providers.
          </div>
        </div>

        {/* Features List */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Everything Included in Pro:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {proFeatures.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <Check size={16} style={{ color: 'var(--accent-emerald)', marginTop: '0.15rem', flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {msg && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'hsl(158, 70%, 94%)',
            color: 'hsl(158, 64%, 28%)',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginBottom: '1rem',
            fontWeight: 600
          }}>
            {msg}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {!isPro ? (
            <button
              onClick={() => handleTogglePlan('pro')}
              disabled={updating}
              className="btn btn-primary btn-lg"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))',
                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
              }}
            >
              <Crown size={18} />
              <span>{updating ? 'Activating Pro Plan...' : 'Upgrade to Pro ($19 USD/mo)'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleTogglePlan('free')}
              disabled={updating}
              className="btn btn-secondary btn-lg"
              style={{ flex: 1 }}
            >
              <span>{updating ? 'Updating...' : 'Switch Back to Free Tier'}</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '1rem' }}>
          <ShieldCheck size={14} /> Modular payment architecture ready for Stripe / Paddle integration.
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
