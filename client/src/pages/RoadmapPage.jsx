import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Lock,
  Crown,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import EmptyState from '../components/EmptyState';

export default function RoadmapPage({ setView, onOpenProModal }) {
  const [roadmap, setRoadmap] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchRoadmap = async () => {
    try {
      const res = await api.get('/roadmap');
      setRoadmap(res.roadmap);
      setIsPro(res.isPro);
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await api.put(`/roadmap/tasks/${taskId}`, { status: newStatus });
      await fetchRoadmap();
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your 30-day roadmap...</div>;
  }

  if (!roadmap) {
    return (
      <EmptyState
        icon={MapPin}
        title="No Roadmap Generated Yet"
        description="Complete your assessment to receive a custom 30-day acceleration sprint broken down week-by-week."
        actionText="Generate Roadmap"
        onAction={() => setView('assessment')}
      />
    );
  }

  const weekHeaders = {
    1: { title: 'Week 1: Foundations & Core Skill Immersion', desc: 'Focus on primary skill gap fundamentals & environment setup.' },
    2: { title: 'Week 2: Practical Application & Mini-Tasks', desc: 'Transition from theory to hands-on small service build.' },
    3: { title: 'Week 3: Portfolio Project Development', desc: 'Architect and construct your demonstrator project.' },
    4: { title: 'Week 4: Project Polish & Market Positioning', desc: 'Finalize demo, documentation, and LinkedIn positioning.' }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header & Progress Stats */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-primary">30-Day Structured Sprint</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>4 Weekly Phases</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.35rem' }}>
              Personalized Career Acceleration Sprint
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
              {roadmap.stats?.progressPercent || 0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {roadmap.stats?.completedTasks} of {roadmap.stats?.totalTasks} Tasks Completed
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.max(5, roadmap.stats?.progressPercent || 0)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--accent-emerald))',
            borderRadius: '999px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* 4 Weekly Sprints */}
      {[1, 2, 3, 4].map((weekNum) => {
        const weekTasks = roadmap.weeks?.[weekNum] || [];
        const header = weekHeaders[weekNum];

        return (
          <div key={weekNum} style={{ marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {weekNum}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {header.title}
                </h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '2.4rem' }}>
                {header.desc}
              </p>
            </div>

            {/* Task Cards for this Week */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginLeft: '1.2rem', paddingLeft: '1.2rem', borderLeft: '2px dashed var(--border-light)' }}>
              {weekTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isInProgress = task.status === 'in_progress';
                const isUpdating = updatingTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderLeft: isCompleted ? '4px solid var(--accent-emerald)' : (isInProgress ? '4px solid var(--accent-amber)' : '1px solid var(--border-light)'),
                      background: isCompleted ? 'hsl(158, 70%, 99%)' : 'white'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>{task.skill}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Week {task.week}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                        {task.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                        {task.description}
                      </p>
                    </div>

                    {/* Status Toggle Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'not_started')}
                        disabled={isUpdating}
                        className={`btn btn-sm ${task.status === 'not_started' ? 'btn-secondary' : ''}`}
                        style={{
                          fontSize: '0.75rem',
                          background: task.status === 'not_started' ? 'var(--surface-hover)' : 'transparent',
                          borderColor: task.status === 'not_started' ? 'var(--border-light)' : 'transparent',
                          color: 'var(--text-muted)'
                        }}
                      >
                        Not Started
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                        disabled={isUpdating}
                        className={`btn btn-sm ${isInProgress ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          fontSize: '0.75rem',
                          background: isInProgress ? 'var(--accent-amber)' : 'white',
                          color: isInProgress ? 'white' : 'var(--text-main)',
                          borderColor: isInProgress ? 'transparent' : 'var(--border-light)'
                        }}
                      >
                        <Clock size={13} />
                        <span>In Progress</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(task.id, 'completed')}
                        disabled={isUpdating}
                        className={`btn btn-sm ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          fontSize: '0.75rem',
                          background: isCompleted ? 'var(--accent-emerald)' : 'white',
                          color: isCompleted ? 'white' : 'var(--text-main)',
                          borderColor: isCompleted ? 'transparent' : 'var(--border-light)'
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Completed</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Pro Locked Previews: 60-Day and 90-Day Advanced Roadmaps */}
      <div style={{
        marginTop: '3rem',
        padding: '2.5rem',
        background: 'linear-gradient(180deg, hsl(210, 40%, 98%) 0%, #ffffff 100%)',
        border: '1px dashed var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(221, 83%, 53%))',
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: '0 6px 16px rgba(124, 58, 237, 0.25)'
        }}>
          <Lock size={22} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          60-Day & 90-Day Advanced Scaling Sprints
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
          Unlock extended specializations, multi-system production deployments, and leadership positioning roadmaps with PathCraft Pro.
        </p>

        <button onClick={onOpenProModal} className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))' }}>
          <Crown size={18} />
          <span>Unlock 60 & 90-Day Plans ($19 USD/mo)</span>
        </button>
      </div>
    </div>
  );
}
