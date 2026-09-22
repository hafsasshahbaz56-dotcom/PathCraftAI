import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Crown, BookOpen } from 'lucide-react';
import { api } from '../api/client';
import EmptyState from '../components/EmptyState';

export default function SkillGapPage({ setView, onOpenProModal }) {
  const [skills, setSkills] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await api.get('/skills');
        setSkills(res.skills);
        setIsPro(res.isPro);
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Diagnosing skill profile...</div>;
  }

  if (!skills) {
    return (
      <EmptyState
        icon={Zap}
        title="Skill Profile Not Yet Analyzed"
        description="Complete your career assessment so our AI diagnostic engine can isolate your strongest assets and priority gaps."
        actionText="Start Assessment"
        onAction={() => setView('assessment')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Recommended Next Skill Card - Hero Focus */}
      <div className="card card-highlight" style={{ padding: '2rem 2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="badge badge-warning" style={{ color: 'hsl(38, 92%, 30%)' }}>
            Primary High-Leverage Skill
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 Core Focus</span>
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
          {skills.recommended_next_skill}
        </h2>

        <p style={{ color: 'var(--text-main)', fontSize: '0.975rem', lineHeight: 1.55, maxWidth: '680px', marginBottom: '1.5rem' }}>
          {skills.next_skill_rationale || 'Mastering this specific skill creates immediate market leverage for your target career direction.'}
        </p>

        <button onClick={() => setView('roadmap')} className="btn btn-primary">
          <BookOpen size={16} />
          <span>See Roadmap Learning Tasks</span>
        </button>
      </div>

      {/* 4-Category Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Priority Focus Skills */}
        <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>Priority Skills (Sprint Focus)</h4>
            <span className="badge badge-primary">{skills.priority_skills?.length || 0}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {skills.priority_skills?.map((item, idx) => (
              <div key={idx} style={{ padding: '0.65rem 0.85rem', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Strong Skills */}
        <div className="card" style={{ borderTop: '3px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Strong Skills</h4>
            <span className="badge badge-success">{skills.strong_skills?.length || 0}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {skills.strong_skills?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developing Skills */}
        <div className="card" style={{ borderTop: '3px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'hsl(38, 92%, 35%)' }}>Developing Skills</h4>
            <span className="badge badge-warning">{skills.developing_skills?.length || 0}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {skills.developing_skills?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                <Zap size={16} color="var(--accent-amber)" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="card" style={{ borderTop: '3px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-purple)' }}>Missing Skills</h4>
            <span className="badge" style={{ background: 'hsl(262, 95%, 95%)', color: 'var(--accent-purple)' }}>{skills.missing_skills?.length || 0}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {skills.missing_skills?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <AlertCircle size={16} color="var(--accent-purple)" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pro Locked Preview: Salary & Advanced Industry Benchmarks */}
      {!isPro && (
        <div style={{
          background: 'linear-gradient(135deg, hsl(262, 95%, 98%) 0%, hsl(221, 95%, 98%) 100%)',
          border: '1px solid hsl(262, 85%, 90%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Crown size={18} />
              <span>Advanced Industry Benchmarks (Pro Feature)</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Unlock real-time compensation bands, hiring velocity metrics, and deep-dive technical interview competencies.
            </p>
          </div>
          <button onClick={onOpenProModal} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))' }}>
            Unlock Benchmarks ($19 USD)
          </button>
        </div>
      )}
    </div>
  );
}
