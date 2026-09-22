import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, AlertCircle, ArrowRight, Dna, Sparkles, Shield } from 'lucide-react';
import { api } from '../api/client';
import EmptyState from '../components/EmptyState';

export default function CareerDirectionPage({ setView }) {
  const [data, setData] = useState(null);
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dirRes, dnaRes] = await Promise.all([
          api.get('/career/direction'),
          api.get('/career/dna')
        ]);
        setData(dirRes.direction);
        setDna(dnaRes.dna);
      } catch (err) {
        console.error('Failed to load career direction:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing career direction...</div>;
  }

  if (!data) {
    return (
      <EmptyState
        icon={Compass}
        title="No Career Direction Identified Yet"
        description="Complete your career assessment to receive an AI-tailored career direction grounded in your skills and goals."
        actionText="Take Assessment"
        onAction={() => setView('assessment')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Guidance Note Disclaimer Banner */}
      <div style={{
        background: 'var(--primary-subtle)',
        border: '1px solid var(--primary-light)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        fontSize: '0.85rem',
        color: 'var(--text-main)'
      }}>
        <Shield size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Guidance Advisory:</strong> {data.guidanceNote}
        </span>
      </div>

      {/* Hero Recommendation Card */}
      <div className="card card-highlight" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">Recommended Direction</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Based on your profile synthesis</span>
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.2 }}>
          {data.careerDirection}
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {data.fitReasoning}
        </p>

        {/* Next Step Highlight */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recommended Next Step
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {data.recommendedNextStep}
            </div>
          </div>
          <button onClick={() => setView('roadmap')} className="btn btn-primary">
            <span>View Roadmap</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Strengths and Considerations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Supporting Strengths */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>Supporting Strengths</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {data.supportingStrengths?.map((strength, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Considerations */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="var(--accent-purple)" />
            <span>Market Considerations</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {data.careerConsiderations?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-purple)', marginTop: '0.45rem', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career DNA Summary Card */}
      {dna && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Dna size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Your Career DNA Record</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>Career Stage</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.2rem' }}>{dna.career_stage || 'Emerging Professional'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>Target Industry</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.2rem' }}>{dna.target_industry || 'Technology'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>Learning Commitment</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.2rem' }}>{dna.learning_preferences || 'Consistent sprint'}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>Brand Direction</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.2rem' }}>{dna.brand_direction || 'Modern Builder'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
