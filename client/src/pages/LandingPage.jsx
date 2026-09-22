import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  MapPin,
  FolderGit2,
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  Award,
  Users,
  Target
} from 'lucide-react';

export default function LandingPage({ onStartAssessment, onOpenAuth, onOpenProModal }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does PathCraft AI determine my recommended career direction?',
      a: 'We evaluate your unique blend of past experience, current skills, target industries, and learning availability. Our Gemini AI engine synthesizes these data points with live tech-market demands to recommend high-leverage roles where your strengths create a competitive advantage.'
    },
    {
      q: 'What makes the 30-Day Roadmap different from generic online courses?',
      a: 'Generic courses dump 50 hours of passive video lectures on you. Our roadmap follows a strict "Learn → Build → Prove" philosophy: Week 1 builds foundational skills, Week 2 applies them with practical mini-tasks, Week 3 architects your portfolio project, and Week 4 guides professional positioning on LinkedIn.'
    },
    {
      q: 'How does the AI Career Coach personalize its advice?',
      a: 'Unlike generic chatbots, the PathCraft Coach receives your live Career DNA, active roadmap tasks, skill gaps, and project status as internal database context. When you ask "I only have 5 hours this week, what should I do?", it guides you directly to your exact highest-priority task.'
    },
    {
      q: 'Can I use PathCraft AI for free?',
      a: 'Yes! Our Free tier includes the complete Career Assessment, your personalized Career Direction, basic Skill Gap diagnosis, initial project recommendation, and access to the AI Coach. You can upgrade to Pro at any time for advanced roadmaps, capstones, and unlimited coaching.'
    },
    {
      q: 'What currency are Pro subscriptions billed in?',
      a: 'All Pro plans are billed in US Dollars (USD: $19/month or $199/year). We support all major international cards and payment providers globally.'
    }
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Public Navbar */}
      <nav style={{
        height: '72px',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 50
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              <Compass size={22} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)' }}>
              PathCraft<span style={{ color: 'var(--primary)' }}>AI</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => onOpenAuth('login')}
              className="btn btn-secondary"
              style={{ border: 'none', background: 'transparent' }}
            >
              Sign In
            </button>
            <button
              onClick={onStartAssessment}
              className="btn btn-primary"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem',
        background: 'radial-gradient(ellipse at top, hsl(221, 95%, 98%) 0%, #ffffff 70%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-light)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={15} />
            <span>AI-Powered Career, Skills & Personal Branding Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em'
          }}>
            Stop Guessing Your Career. <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Start Building It.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 2.5rem'
          }}>
            Get a personalized career direction, skill roadmap, project plan, and professional growth guidance — powered by AI.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onStartAssessment}
              className="btn btn-primary btn-lg"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
              }}
            >
              <span>Start Your Career Assessment</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#how-it-works"
              className="btn btn-secondary btn-lg"
            >
              See How It Works
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} color="var(--accent-emerald)" /> Free 5-min assessment</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} color="var(--accent-emerald)" /> Context-aware Gemini AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Check size={16} color="var(--accent-emerald)" /> Practical 30-day roadmap</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-app)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '960px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            The Career Trap
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '2.5rem' }}>
            Why Most Professionals Stay Stuck
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'hsl(350, 89%, 95%)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Direction Paralysis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Endless job titles and conflicting advice online create overwhelm instead of clarity on which role actually suits your strengths.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'hsl(38, 92%, 94%)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tutorial Hell</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Watching video tutorials without building real-world projects leaves candidates with zero demonstrable proof to show employers.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Invisible Positioning</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Generic LinkedIn profiles and non-existent personal branding mean qualified candidates get lost in applicant tracking systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Systematic Growth Loop
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem' }}>
            Assess &bull; Understand &bull; Diagnose &bull; Plan &bull; Build &bull; Brand &bull; Grow
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem' }}>
            PathCraft AI transforms vague career goals into an actionable week-by-week sprint engineered for real opportunities.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { step: '01', title: 'Assess', desc: '12 focused questions covering skills, time, goals, and interests.' },
              { step: '02', title: 'Diagnose', desc: 'Gemini analyzes your strengths and isolates 3-5 priority skill gaps.' },
              { step: '03', title: 'Plan', desc: 'Synthesizes your 30-day roadmap with concrete weekly tasks.' },
              { step: '04', title: 'Build', desc: 'Guides you through real portfolio projects (Learn → Build → Prove).' },
              { step: '05', title: 'Brand', desc: 'Generates tailored LinkedIn headlines, About summaries, and themes.' },
              { step: '06', title: 'Coach', desc: 'Context-aware AI answers: "What should I do next?" 24/7.' }
            ].map((s, idx) => (
              <div key={idx} className="card" style={{ textAlign: 'left', borderTop: '3px solid var(--primary)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-display)' }}>
                  {s.step}
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.35rem 0' }}>{s.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Pro Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-app)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Transparent Pricing
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1rem' }}>
            Start Free. Upgrade for Pro Acceleration.
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
            Transparent pricing in US Dollars ($). No hidden fees. Cancel anytime.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {/* Free Card */}
            <div className="card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column' }}>
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Starter</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Free Tier</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.75rem 0' }}>$0</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Ideal for exploring career directions and receiving initial skill diagnostics.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem', flex: 1 }}>
                {['Full Career Assessment', 'Career Snapshot & Direction', 'Priority Skill Gap Identification', '30-Day Roadmap Sprint Preview', '1 Portfolio Project Blueprint', 'Standard AI Career Coach (20 msgs)'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Check size={16} color="var(--accent-emerald)" /> <span>{f}</span>
                  </div>
                ))}
              </div>

              <button onClick={onStartAssessment} className="btn btn-secondary btn-lg" style={{ width: '100%' }}>
                Get Started Free
              </button>
            </div>

            {/* Pro Card */}
            <div className="card" style={{
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid var(--accent-purple)',
              boxShadow: 'var(--shadow-xl)',
              background: 'linear-gradient(180deg, #ffffff 0%, hsl(262, 95%, 99%) 100%)'
            }}>
              <span className="badge badge-pro" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>Most Popular</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Pro Acceleration</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.75rem 0' }}>
                $19 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>USD / month</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                For ambitious builders serious about landing high-value modern roles.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem', flex: 1 }}>
                {[
                  'Everything in Free',
                  'Persistent Career DNA Synthesis',
                  'Full 30, 60 & 90-Day Roadmaps',
                  'Unlimited Capstone Project Guides',
                  'Complete Personal Brand Gap Analysis',
                  'AI-Generated LinkedIn Headlines & About',
                  'Unlimited 24/7 Contextual AI Coaching',
                  'Priority Model Speed & Instant Resync'
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Check size={16} color="var(--accent-purple)" /> <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenProModal}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--primary))',
                  boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
                }}
              >
                Upgrade to Pro ($19 USD)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{ cursor: 'pointer', padding: '1.25rem 1.5rem' }}
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem' }}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                  {isOpen && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.85rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, hsl(221, 83%, 53%), hsl(262, 83%, 58%))',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Take Control of Your Career Trajectory Today
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2.5rem' }}>
            Join thousands of professionals using structured AI guidance to move from uncertainty to high-demand skills and projects.
          </p>
          <button
            onClick={onStartAssessment}
            className="btn btn-lg"
            style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span>Start Free Career Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2.5rem 0', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <p>&copy; 2026 PathCraft AI. All rights reserved. Designed for opportunity.</p>
        </div>
      </footer>
    </div>
  );
}
