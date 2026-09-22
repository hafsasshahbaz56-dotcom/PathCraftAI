import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  FileText
} from 'lucide-react';
import { api } from '../api/client';
import EmptyState from '../components/EmptyState';

export default function BrandPage({ setView, onOpenProModal }) {
  const [brand, setBrand] = useState(null);
  const [linkedin, setLinkedin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);

  useEffect(() => {
    async function fetchBrandData() {
      try {
        const res = await api.get('/brand');
        setBrand(res.brand);
        setLinkedin(res.linkedin);
      } catch (err) {
        console.error('Failed to load branding data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrandData();
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Synthesizing brand positioning & LinkedIn guidance...</div>;
  }

  if (!brand || !linkedin) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Personal Brand Not Yet Analyzed"
        description="Complete your assessment so we can audit your positioning gaps and draft high-converting LinkedIn copy."
        actionText="Take Assessment"
        onAction={() => setView('assessment')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary">Market Positioning</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Personal Brand &bull; LinkedIn Optimization</span>
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Personal Brand & LinkedIn Strategy
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Transition from invisible applicant to recognized practitioner in your target domain.
        </p>
      </div>

      {/* Positioning Contrast Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Current Positioning */}
        <div className="card" style={{ borderLeft: '4px solid var(--text-subtle)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Apparent Positioning
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.4rem', marginBottom: '0.65rem', color: 'var(--text-main)' }}>
            {brand.current_positioning}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Where your background currently projects in the market before strategic alignment.
          </p>
        </div>

        {/* Target Positioning */}
        <div className="card card-highlight" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Target Desired Positioning
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.4rem', marginBottom: '0.65rem', color: 'var(--text-main)' }}>
            {brand.target_positioning}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            What you should be publicly known for to capture premium opportunities and inbound interest.
          </p>
        </div>
      </div>

      {/* Brand Gaps & Recommended Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Brand Gaps */}
        <div className="card">
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)' }}>
            <AlertCircle size={18} />
            <span>Identified Positioning Gaps</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {brand.gaps?.map((gap, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-rose)', marginTop: '0.5rem', flexShrink: 0 }} />
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="card">
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)' }}>
            <TrendingUp size={18} />
            <span>Recommended Strategic Moves</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {brand.recommendations?.map((action, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-emerald)', minWidth: '18px' }}>{i + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI-Generated LinkedIn Guidance Section */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Share2 size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Tailored LinkedIn Optimization Assets</h3>
        </div>

        {/* 1. Suggested Headline */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ fontSize: '0.9rem' }}>Suggested LinkedIn Headline</label>
            <button
              onClick={() => copyToClipboard(linkedin.headline, 'headline')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {copiedHeadline ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              <span>{copiedHeadline ? 'Copied!' : 'Copy Headline'}</span>
            </button>
          </div>
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '1rem',
            color: 'var(--text-main)'
          }}>
            {linkedin.headline}
          </div>
        </div>

        {/* 2. Suggested About Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ fontSize: '0.9rem' }}>Suggested Professional About Draft</label>
            <button
              onClick={() => copyToClipboard(linkedin.about, 'about')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {copiedAbout ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              <span>{copiedAbout ? 'Copied!' : 'Copy About'}</span>
            </button>
          </div>
          <div style={{
            padding: '1.25rem',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.925rem',
            color: 'var(--text-main)',
            lineHeight: 1.6,
            whiteSpace: 'pre-line'
          }}>
            {linkedin.about}
          </div>
        </div>

        {/* 3. Content Themes / Topics to Post About */}
        <div>
          <label className="input-label" style={{ fontSize: '0.9rem', marginBottom: '0.65rem' }}>
            3-5 Core Content Pillars & Post Themes
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {linkedin.content_topics?.map((topic, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  background: 'white',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)'
                }}
              >
                <MessageSquare size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
