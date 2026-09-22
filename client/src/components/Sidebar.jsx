import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  Compass,
  Zap,
  MapPin,
  FolderGit2,
  Sparkles,
  Bot,
  User,
  Settings,
  LogOut,
  X,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentView, setView, mobileOpen, setMobileOpen, onOpenProModal }) {
  const { user, logout, isPro } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Career Assessment', icon: ClipboardCheck },
    { id: 'direction', label: 'Career Direction', icon: Compass },
    { id: 'skills', label: 'Skill Gap Analysis', icon: Zap },
    { id: 'roadmap', label: '30-Day Roadmap', icon: MapPin },
    { id: 'projects', label: 'Recommended Projects', icon: FolderGit2 },
    { id: 'brand', label: 'Personal Brand & LinkedIn', icon: Sparkles },
    { id: 'coach', label: 'AI Career Coach', icon: Bot, badge: 'AI' },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setView(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 35
          }}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => handleNavClick('dashboard')}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              <Compass size={20} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                PathCraft<span style={{ color: 'var(--primary)' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Career Growth Platform
              </div>
            </div>
          </div>

          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', padding: '0 0.75rem 0.5rem', letterSpacing: '0.05em' }}>
            Main Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pro Banner or Status */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
          {!isPro ? (
            <div style={{
              background: 'linear-gradient(135deg, hsl(221, 95%, 97%), hsl(262, 95%, 97%))',
              border: '1px solid hsl(221, 85%, 90%)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              textAlign: 'center',
              marginBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Crown size={16} /> Upgrade to Pro
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.35rem 0 0.65rem' }}>
                Full 90-day roadmaps, capstones & unlimited AI Coach.
              </div>
              <button
                onClick={onOpenProModal}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))' }}
              >
                View Plans ($19/mo)
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              background: 'hsl(158, 70%, 95%)',
              border: '1px solid hsl(158, 70%, 85%)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'hsl(158, 64%, 28%)' }}>
                <Crown size={15} /> Pro Member
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
            </div>
          )}

          {/* User & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: 'var(--radius-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
