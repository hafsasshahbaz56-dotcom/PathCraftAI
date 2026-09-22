import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import LoadingScreen from '../components/LoadingScreen';

export default function AssessmentPage({ onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      const cached = localStorage.getItem('draft_assessment_answers');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch assessment questions from backend
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await api.get('/assessment');
        setQuestions(data.questions || []);
        if (data.assessment?.answers && Object.keys(data.assessment.answers).length > 0) {
          setAnswers(prev => ({ ...data.assessment.answers, ...prev }));
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('Failed to fetch assessment questions. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Persist answers to local storage on change
  useEffect(() => {
    localStorage.setItem('draft_assessment_answers', JSON.stringify(answers));
  }, [answers]);

  if (submitting) {
    return <LoadingScreen title="Synthesizing Your Career Growth Architecture..." />;
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading assessment questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={32} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
        <h3>Unable to load questions</h3>
        <p style={{ color: 'var(--text-muted)' }}>{error || 'Please check your connection and try again.'}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ.id] || '';
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (opt) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleTextChange = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  const canContinue = !!currentAnswer && (typeof currentAnswer === 'string' ? currentAnswer.trim().length > 0 : true);

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission
      setSubmitting(true);
      setError('');
      try {
        const res = await api.post('/assessment/submit', { answers });
        localStorage.removeItem('draft_assessment_answers');
        if (onComplete) onComplete(res);
      } catch (err) {
        console.error('Submission failed:', err);
        setSubmitting(false);
        setError(err.message || 'We could not generate your career plan right now. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 0' }} className="animate-fade-in">
      {/* Progress Bar & Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {progressPercent}% Completed
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--accent-purple))',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '1.75rem',
          lineHeight: 1.35
        }}>
          {currentQ.title}
        </h3>

        {/* Options List for Single Select */}
        {currentQ.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((opt, i) => {
              const isSelected = currentAnswer === opt;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    background: isSelected ? 'var(--primary-subtle)' : 'white',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Text Area for open answers */}
        {currentQ.type === 'textarea' && (
          <div className="input-group" style={{ marginBottom: 0 }}>
            <textarea
              rows={4}
              className="input-field"
              placeholder={currentQ.placeholder || 'Type your response here...'}
              value={currentAnswer}
              onChange={(e) => handleTextChange(e.target.value)}
              style={{ fontSize: '1rem', lineHeight: 1.5 }}
            />
          </div>
        )}

        {/* Text Input for skills / multiselect */}
        {currentQ.type === 'multiselect_or_text' && (
          <div className="input-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="input-field"
              placeholder={currentQ.placeholder || 'e.g. JavaScript, Python, UI Design'}
              value={currentAnswer}
              onChange={(e) => handleTextChange(e.target.value)}
              style={{ fontSize: '1rem' }}
            />
            <span style={{ fontSize: '0.775rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
              Separate skills or tools with commas.
            </span>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1rem',
            background: 'hsl(350, 89%, 96%)',
            color: 'var(--accent-rose)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="btn btn-primary btn-lg"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
            boxShadow: canContinue ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none'
          }}
        >
          <span>{currentIndex === questions.length - 1 ? 'Complete & Synthesize Plan' : 'Continue'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
