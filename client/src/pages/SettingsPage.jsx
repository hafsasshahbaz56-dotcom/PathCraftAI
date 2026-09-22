import React, { useState } from 'react';
import { Settings, Crown, Shield, CreditCard, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage({ onOpenProModal }) {
  const { user, isPro, updateSubscription } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const toggleTier = async () => {
    setUpdating(true);
    setMsg('');
    try {
      const next = isPro ? 'free' : 'pro';
      await updateSubscription(next);
      setMsg(`Subscription successfully switched to ${next.toUpperCase()} tier.`);
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('Failed to update subscription: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Account & Subscription Settings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          Manage your account profile, subscription plan, and billing preferences.
        </p>
      </div>

      {msg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'hsl(158, 70%, 94%)',
          color: 'hsl(158, 64%, 28%)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          {msg}
        </div>
      )}

      {/* Account Info Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Account Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>User ID</span>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
              {user?.id}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Email</span>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {user?.email}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Name</span>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {user?.name}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Current Plan</span>
            <div style={{ marginTop: '0.2rem' }}>
              <span className={`badge ${isPro ? 'badge-pro' : 'badge-primary'}`}>
                {isPro ? 'PRO TIER' : 'FREE TIER'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Subscription Tier & Billing
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Primary billing currency: <strong>US Dollars (USD $)</strong>
            </p>
          </div>

          <button
            onClick={toggleTier}
            disabled={updating}
            className={`btn ${isPro ? 'btn-secondary' : 'btn-primary'}`}
          >
            <Crown size={16} />
            <span>{updating ? 'Updating...' : (isPro ? 'Downgrade to Free Tier' : 'Upgrade to Pro ($19 USD/mo)')}</span>
          </button>
        </div>

        <div style={{
          padding: '1.25rem',
          background: 'var(--bg-app)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6
        }}>
          <strong>Payment Architecture:</strong> Configured for international billing with USD ($) as standard. The server securely stores subscription state without hardcoded client secrets, structured for seamless integration with Stripe or Azure billing webhooks.
        </div>
      </div>

      {/* Security & Secrets Note */}
      <div className="card" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
          <Shield size={18} />
          <span>Security & User Data Isolation</span>
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          All AI API keys and database credentials remain strictly server-side. User records, assessments, roadmaps, and chat histories are isolated by unique account identifier and protected by signed JWT authentication.
        </p>
      </div>
    </div>
  );
}
