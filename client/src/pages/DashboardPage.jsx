import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  Zap,
  MapPin,
  FolderGit2,
  Sparkles,
  Bot,
  CheckCircle2,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';
import NextBestActionCard from '../components/NextBestActionCard';
import EmptyState from '../components/EmptyState';

export default function DashboardPage({ setView, onOpenProModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get('/dashboard');
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your career control center...
      </div>
    );
  }

  // If user hasn't completed assessment yet
  if (!data?.hasCompletedAssessment) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <EmptyState
          icon={Compass}
          title="Unlock Your Personalized Career Architecture"
          description="You haven't completed your career assessment yet. Take 5 minutes to discover your Career DNA, priority skill gaps, 30-day roadmap, and recommended projects."
          actionText="Start Career Assessment"
          onAction={() => setView('assessment')}
        />
      </div>
    );
  }

  const handleNextActionClick = () => {
    if (data.nextBestAction?.ctaLink) {
      const targetView = data.nextBestAction.ctaLink.replace('/', '');
      setView(targetView);
    } else {
      setView('roadmap');
    }
  };

  const handleAskCoachWhy = () => {
    setView('coach');
  };

  return (
    <div className="animate-fade-in">
      {/* 1. Next Best Action - Primary Strongest CTA */}
      <NextBestActionCard
        action={data.nextBestAction}
        onAction={handleNextActionClick}
        onAskCoach={handleAskCoachWhy}
      />

      {/* 2. Key Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Career Direction */}
        <div className="card card-highlight">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Career Direction
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              {data.confidenceScore || 88}% Match
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {data.careerDirection}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Current Focus: <strong>{data.currentFocus}</strong>
          </p>
          <button
            onClick={() => setView('direction')}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>View Full Analysis</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Overall Career Progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sprint Acceleration Progress
            </span>
            <TrendingUp size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
              {data.progressPercent}%
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>completed</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{
              width: `${Math.max(5, data.progressPercent)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-emerald), var(--primary))',
              borderRadius: '999px'
            }} />
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Calculated across active roadmap sprints & portfolio projects.
          </div>
        </div>

        {/* Priority Skill Gap */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recommended Next Skill
            </span>
            <Zap size={16} color="var(--accent-amber)" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {data.skillSummary?.recommendedNextSkill || 'Core Foundations'}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Priority Gaps: <strong>{data.skillSummary?.prioritySkills?.length || 3} skills</strong> isolated for focus.
          </p>
          <button
            onClick={() => setView('skills')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Diagnose Skill Gaps</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. Detailed Action Columns: Roadmap Sprint + Recommended Project */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Roadmap Sprint Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>30-Day Sprint Roadmap</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Week {data.roadmapSummary?.currentWeek} Active</span>
              </div>
            </div>
            <span className="badge badge-primary">
              {data.roadmapSummary?.completedTasks} / {data.roadmapSummary?.totalTasks} Tasks
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>
            Your structured sprint moves systematically through foundational learning, practical mini-tasks, capstone building, and positioning.
          </p>

          <button onClick={() => setView('roadmap')} className="btn btn-secondary" style={{ width: '100%' }}>
            <span>Open 30-Day Sprint Plan</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Recommended Project Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'hsl(262, 95%, 95%)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderGit2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Active Portfolio Project</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Learn &rarr; Build &rarr; Prove</span>
              </div>
            </div>
            <span className={`badge ${data.recommendedProject?.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
              {data.recommendedProject?.status?.replace('_', ' ') || 'Not Started'}
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem', flex: 1 }}>
            <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {data.recommendedProject?.title || 'Portfolio Project'}
            </h5>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {data.recommendedProject?.objective || 'Hands-on project to demonstrate verifiable skill mastery.'}
            </p>
          </div>

          <button onClick={() => setView('projects')} className="btn btn-primary" style={{ width: '100%' }}>
            <span>Continue Building Project</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 4. Personal Brand & Coach Quick Launch Banner */}
      <div style={{
        background: 'linear-gradient(135deg, hsl(210, 40%, 98%) 0%, #ffffff 100%)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Personal Brand & LinkedIn Positioning</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Positioning: <strong>{data.brandSummary?.targetPositioning}</strong> &bull; {data.brandSummary?.gapsCount} gaps identified
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setView('brand')} className="btn btn-secondary">
            <span>View LinkedIn Guidance</span>
          </button>
          <button onClick={() => setView('coach')} className="btn btn-primary">
            <Bot size={16} />
            <span>Chat with Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
}
