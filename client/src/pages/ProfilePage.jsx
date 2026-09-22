import React, { useState, useEffect } from 'react';
import { User, Save, Dna, Check, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    career_stage: '',
    education: '',
    experience: '',
    skills: '',
    interests: '',
    career_goals: '',
    target_industry: '',
    work_style: '',
    learning_time: '',
    aspirations: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [syncDna, setSyncDna] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/profile');
        if (res.profile) {
          setProfile({
            career_stage: res.profile.career_stage || '',
            education: res.profile.education || '',
            experience: res.profile.experience || '',
            skills: Array.isArray(res.profile.skills) ? res.profile.skills.join(', ') : (res.profile.skills || ''),
            interests: Array.isArray(res.profile.interests) ? res.profile.interests.join(', ') : (res.profile.interests || ''),
            career_goals: res.profile.career_goals || '',
            target_industry: res.profile.target_industry || '',
            work_style: res.profile.work_style || '',
            learning_time: res.profile.learning_time || '',
            aspirations: res.profile.aspirations || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/profile', {
        ...profile,
        sync_career_dna: syncDna
      });
      setMessage('Profile updated successfully' + (syncDna ? ' and Career DNA resynchronized!' : '.'));
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading profile data...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Your Professional Profile
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          This data informs your Career DNA and personalizes all roadmap tasks, project suggestions, and coach guidance.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {message && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: message.includes('Failed') ? 'hsl(350, 89%, 96%)' : 'hsl(158, 70%, 94%)',
            color: message.includes('Failed') ? 'var(--accent-rose)' : 'hsl(158, 64%, 28%)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Account Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" disabled value={user?.name || ''} className="input-field" style={{ background: 'var(--bg-app)' }} />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="text" disabled value={user?.email || ''} className="input-field" style={{ background: 'var(--bg-app)' }} />
            </div>
          </div>

          {/* Career Stage & Target Industry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Career Stage</label>
              <input
                type="text"
                value={profile.career_stage}
                onChange={(e) => handleChange('career_stage', e.target.value)}
                className="input-field"
                placeholder="e.g. Early Career (1-3 years)"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Target Industry</label>
              <input
                type="text"
                value={profile.target_industry}
                onChange={(e) => handleChange('target_industry', e.target.value)}
                className="input-field"
                placeholder="e.g. Software & AI Technology"
              />
            </div>
          </div>

          {/* Education & Available Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Education Background</label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="input-field"
                placeholder="e.g. Bachelor's in CS / Self-taught"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Weekly Learning Time</label>
              <input
                type="text"
                value={profile.learning_time}
                onChange={(e) => handleChange('learning_time', e.target.value)}
                className="input-field"
                placeholder="e.g. 6 - 10 hours per week"
              />
            </div>
          </div>

          {/* Current Skills */}
          <div className="input-group">
            <label className="input-label">Current Skills & Tools (comma separated)</label>
            <input
              type="text"
              value={profile.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              className="input-field"
              placeholder="e.g. JavaScript, React, Python, Git"
            />
          </div>

          {/* Interests */}
          <div className="input-group">
            <label className="input-label">Interests & Exciting Domains (comma separated)</label>
            <input
              type="text"
              value={profile.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              className="input-field"
              placeholder="e.g. Artificial Intelligence, Cloud Infrastructure, Product Design"
            />
          </div>

          {/* Career Goals */}
          <div className="input-group">
            <label className="input-label">Primary 12-Month Career Goal</label>
            <input
              type="text"
              value={profile.career_goals}
              onChange={(e) => handleChange('career_goals', e.target.value)}
              className="input-field"
              placeholder="e.g. Land my first high-paying AI engineering role"
            />
          </div>

          {/* Experience Summary */}
          <div className="input-group">
            <label className="input-label">Past Experience Summary</label>
            <textarea
              rows={3}
              value={profile.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              className="input-field"
              placeholder="Brief summary of what you have built or worked on..."
            />
          </div>

          {/* Long-Term Aspirations */}
          <div className="input-group">
            <label className="input-label">3-Year Professional Aspirations</label>
            <textarea
              rows={3}
              value={profile.aspirations}
              onChange={(e) => handleChange('aspirations', e.target.value)}
              className="input-field"
              placeholder="Where do you dream of seeing yourself professionally in 3 years?"
            />
          </div>

          {/* DNA Resync Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: 'var(--bg-app)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
            border: '1px solid var(--border-light)'
          }}>
            <input
              type="checkbox"
              id="syncDna"
              checked={syncDna}
              onChange={(e) => setSyncDna(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="syncDna" style={{ fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              <strong>Re-synchronize Career DNA</strong> with updated skills and goals on save.
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
