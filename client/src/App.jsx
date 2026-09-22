import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ProGateModal from './components/ProGateModal';
import LandingPage from './pages/LandingPage';
import AuthModal from './pages/AuthModal';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import CareerDirectionPage from './pages/CareerDirectionPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import ProjectsPage from './pages/ProjectsPage';
import BrandPage from './pages/BrandPage';
import CoachPage from './pages/CoachPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [proModalOpen, setProModalOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        color: 'var(--text-muted)'
      }}>
        Initializing PathCraft AI...
      </div>
    );
  }

  // If not logged in, render Public Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onStartAssessment={() => {
            setAuthMode('register');
            setAuthModalOpen(true);
          }}
          onOpenAuth={(mode = 'login') => {
            setAuthMode(mode);
            setAuthModalOpen(true);
          }}
          onOpenProModal={() => {
            setAuthMode('register');
            setAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(mode) => {
            setView(mode === 'register' ? 'assessment' : 'dashboard');
          }}
        />
      </>
    );
  }

  // View title helper
  const viewTitles = {
    dashboard: 'Dashboard',
    assessment: 'Career Assessment',
    direction: 'Career Direction',
    skills: 'Skill Gap Analysis',
    roadmap: '30-Day Roadmap',
    projects: 'Recommended Projects',
    brand: 'Personal Brand & LinkedIn',
    coach: 'AI Career Coach',
    profile: 'User Profile',
    settings: 'Settings'
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setView={setView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenProModal={() => setProModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Topbar
          viewTitle={viewTitles[currentView] || 'PathCraft AI'}
          setMobileOpen={setMobileOpen}
          setView={setView}
          onOpenProModal={() => setProModalOpen(true)}
        />

        <main className="page-container">
          {currentView === 'dashboard' && (
            <DashboardPage
              setView={setView}
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}

          {currentView === 'assessment' && (
            <AssessmentPage
              onComplete={() => setView('dashboard')}
            />
          )}

          {currentView === 'direction' && (
            <CareerDirectionPage
              setView={setView}
            />
          )}

          {currentView === 'skills' && (
            <SkillGapPage
              setView={setView}
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}

          {currentView === 'roadmap' && (
            <RoadmapPage
              setView={setView}
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsPage
              setView={setView}
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}

          {currentView === 'brand' && (
            <BrandPage
              setView={setView}
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}

          {currentView === 'coach' && (
            <CoachPage
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage />
          )}

          {currentView === 'settings' && (
            <SettingsPage
              onOpenProModal={() => setProModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Pro Tier Upgrade Modal */}
      <ProGateModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
      />
    </div>
  );
}
