import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Play,
  ArrowRight,
  Code,
  Wrench,
  Share2,
  Briefcase,
  Layers,
  Crown,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import EmptyState from '../components/EmptyState';

export default function ProjectsPage({ setView, onOpenProModal }) {
  const [projects, setProjects] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.projects || []);
      setIsPro(res.isPro);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateStatus = async (projectId, newStatus) => {
    setUpdatingId(projectId);
    try {
      await api.put(`/projects/${projectId}`, { status: newStatus });
      await fetchProjects();
    } catch (err) {
      console.error('Failed to update project status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Curating recommended portfolio projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No Project Recommendations Available"
        description="Complete your career assessment so we can recommend tailored projects that solve the Learn → Build → Prove equation."
        actionText="Take Career Assessment"
        onAction={() => setView('assessment')}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary">Portfolio Proof Engine</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Learn &bull; Build &bull; Prove</span>
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Recommended Practical Projects
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Real-world projects designed to transform theoretical skill gaps into undeniable public evidence.
        </p>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        {projects.map((proj) => {
          const isCompleted = proj.status === 'completed';
          const isInProgress = proj.status === 'in_progress';
          const isUpdating = updatingId === proj.id;

          return (
            <div
              key={proj.id}
              className="card"
              style={{
                padding: '2rem 2.5rem',
                borderLeft: isCompleted ? '5px solid var(--accent-emerald)' : (isInProgress ? '5px solid var(--accent-amber)' : '1px solid var(--border-light)')
              }}
            >
              {/* Card Top Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className={`badge ${proj.difficulty === 'Beginner' ? 'badge-primary' : 'badge-warning'}`}>
                    {proj.difficulty}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    {proj.career_relevance || 'High Market Relevance'}
                  </span>
                </div>

                <span className={`badge ${isCompleted ? 'badge-success' : (isInProgress ? 'badge-warning' : 'badge-primary')}`}>
                  {proj.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Title & Objective */}
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {proj.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                {proj.objective}
              </p>

              {/* Skills & Tools Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', padding: '1.25rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Code size={14} /> <span>Skills Targeted</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {proj.skills?.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Wrench size={14} /> <span>Recommended Stack</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {proj.tools?.map((t, i) => (
                      <span key={i} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Guidance */}
              {proj.steps && proj.steps.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                    Implementation Steps:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {proj.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '18px' }}>{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Description & LinkedIn Content Idea */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <Briefcase size={14} /> <span>Portfolio Presentation</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {proj.portfolio_description}
                  </p>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <Share2 size={14} /> <span>LinkedIn Post Angle</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    "{proj.linkedin_content_idea}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {proj.status === 'not_started' && (
                  <button
                    onClick={() => handleUpdateStatus(proj.id, 'in_progress')}
                    disabled={isUpdating}
                    className="btn btn-primary"
                  >
                    <Play size={15} />
                    <span>Start Project</span>
                  </button>
                )}

                {isInProgress && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(proj.id, 'completed')}
                      disabled={isUpdating}
                      className="btn btn-primary"
                      style={{ background: 'var(--accent-emerald)' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>Mark Project as Completed</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(proj.id, 'not_started')}
                      disabled={isUpdating}
                      className="btn btn-secondary"
                    >
                      <span>Pause Project</span>
                    </button>
                  </>
                )}

                {isCompleted && (
                  <button
                    onClick={() => handleUpdateStatus(proj.id, 'in_progress')}
                    disabled={isUpdating}
                    className="btn btn-secondary"
                  >
                    <span>Reopen Project</span>
                  </button>
                )}

                <button
                  onClick={() => setView('coach')}
                  className="btn btn-secondary"
                  style={{ marginLeft: 'auto' }}
                >
                  <span>Ask Coach for Build Tips</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Capstone Project Preview */}
      {!isPro && (
        <div style={{
          padding: '2.5rem',
          background: 'linear-gradient(180deg, hsl(262, 95%, 98%) 0%, #ffffff 100%)',
          border: '1px dashed hsl(262, 85%, 85%)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center'
        }}>
          <span className="badge badge-pro" style={{ marginBottom: '0.75rem' }}>Pro Capstones</span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Looking for Production-Scale Enterprise Capstones?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Upgrade to PathCraft Pro to unlock 5+ specialized multi-agent architectures, scalable SaaS templates, and deployment blueprints.
          </p>
          <button onClick={onOpenProModal} className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))' }}>
            <Crown size={18} />
            <span>Unlock All Capstone Blueprints ($19 USD/mo)</span>
          </button>
        </div>
      )}
    </div>
  );
}
