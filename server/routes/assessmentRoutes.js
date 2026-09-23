const express = require('express');
const {
  assessmentRepo,
  profileRepo,
  careerDnaRepo,
  skillRepo,
  roadmapRepo,
  projectRepo,
  brandRepo,
  linkedinRepo
} = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

const ASSESSMENT_QUESTIONS = [
  {
    id: 'career_stage',
    title: 'What best describes your current career stage?',
    type: 'select',
    options: [
      'Student / Recent Graduate',
      'Early Career (1-3 years)',
      'Mid-Level (4-8 years)',
      'Career Switcher / Pivoting',
      'Senior / Leadership'
    ]
  },
  {
    id: 'education',
    title: 'What is your highest educational background?',
    type: 'select',
    options: [
      'High School / Self-Taught',
      'Associate Degree',
      'Bachelor’s Degree',
      'Master’s Degree or Ph.D.',
      'Bootcamp / Specialized Certifications'
    ]
  },
  {
    id: 'current_skills',
    title: 'What skills or tools do you currently feel most confident in?',
    type: 'multiselect_or_text',
    placeholder: 'e.g. JavaScript, Python, Data Analysis, Content Creation, Project Management, Figma'
  },
  {
    id: 'experience_summary',
    title: 'Briefly summarize your past work or project experience:',
    type: 'textarea',
    placeholder: 'e.g. Built full-stack web apps, ran social media accounts, interned in finance...'
  },
  {
    id: 'interests',
    title: 'What topics or domains excite you the most right now?',
    type: 'multiselect_or_text',
    placeholder: 'e.g. Artificial Intelligence, Cloud Computing, Product Design, Marketing, Web Development'
  },
  {
    id: 'target_industry',
    title: 'What target industry are you aiming for?',
    type: 'select',
    options: [
      'Software & AI Technology',
      'Digital Marketing & Growth',
      'Data Science & Analytics',
      'Fintech & Financial Services',
      'Design, UX & Creative Tech',
      'HealthTech / Biotech',
      'E-commerce & SaaS'
    ]
  },
  {
    id: 'career_goals',
    title: 'What is your primary goal for the next 6-12 months?',
    type: 'select',
    options: [
      'Land my first high-paying tech role',
      'Transition into an AI-forward career',
      'Earn a promotion or senior title',
      'Build independent freelance / consulting projects',
      'Gain clarity on which specific role fits me best'
    ]
  },
  {
    id: 'confidence_level',
    title: 'How confident do you currently feel about your career trajectory?',
    type: 'select',
    options: [
      '1 - Completely uncertain, need direction',
      '2 - Somewhat unclear on what skills to build next',
      '3 - Have some direction, but missing a solid roadmap',
      '4 - Confident, but need portfolio projects and personal branding'
    ]
  },
  {
    id: 'learning_time',
    title: 'How much time can you realistically invest per week in learning & building?',
    type: 'select',
    options: [
      '3 - 5 hours per week (Part-time light)',
      '6 - 10 hours per week (Consistent sprint)',
      '11 - 20 hours per week (Accelerated focus)',
      '20+ hours per week (Full-time immersion)'
    ]
  },
  {
    id: 'work_style',
    title: 'What is your preferred work style and environment?',
    type: 'select',
    options: [
      'Fully Remote / Distributed teams',
      'Hybrid / Collaborative office',
      'Independent / Freelance / Solopreneur',
      'High-growth fast-paced startup',
      'Structured established enterprise'
    ]
  },
  {
    id: 'frustrations',
    title: 'What has been your biggest career roadblock recently?',
    type: 'select',
    options: [
      'Tutorial hell without building real projects',
      'Job postings ask for skills I do not have',
      'No clear online presence or personal brand',
      'Overwhelmed by AI and don’t know where to start',
      'Lack of accountability and clear week-by-week plan'
    ]
  },
  {
    id: 'aspirations',
    title: 'Where do you dream of seeing yourself professionally in 3 years?',
    type: 'textarea',
    placeholder: 'e.g. Recognized senior AI engineer, leading a creative growth team, or building impactful digital products...'
  }
];

// GET questions and status
router.get('/', requireAuth, async (req, res) => {
  try {
    const assessment = await assessmentRepo.getByUserId(req.user.id);
    res.json({
      questions: ASSESSMENT_QUESTIONS,
      assessment: assessment || { answers: {}, completed: false }
    });
  } catch (err) {
    console.error('Fetch assessment error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment questions.' });
  }
});

// SUBMIT answers and trigger end-to-end AI orchestration
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Valid assessment answers are required.' });
    }

    const userId = req.user.id;

    // 1. Save completed assessment
    await assessmentRepo.save(userId, answers, true);

    // Update profile with matching answers
    const profile = await profileRepo.upsert(userId, {
      career_stage: answers.career_stage || '',
      education: answers.education || '',
      experience: answers.experience_summary || '',
      skills: typeof answers.current_skills === 'string' ? answers.current_skills.split(',').map(s => s.trim()) : (answers.current_skills || []),
      interests: typeof answers.interests === 'string' ? answers.interests.split(',').map(s => s.trim()) : (answers.interests || []),
      career_goals: answers.career_goals || '',
      target_industry: answers.target_industry || '',
      work_style: answers.work_style || '',
      learning_time: answers.learning_time || '',
      aspirations: answers.aspirations || ''
    });

    console.log(`[AI Orchestrator] Generating cohesive Career Growth Plan for user ${userId}...`);

    // Master synthesis
    const fullPlan = await AIService.synthesizeFullCareerPlan(answers, profile);

    // Save all synthesized entities
    await careerDnaRepo.upsert(userId, fullPlan.careerDNA);
    await skillRepo.upsert(userId, fullPlan.skillAnalysis);
    await roadmapRepo.upsert(userId, fullPlan.roadmap?.duration || 30, fullPlan.roadmap?.tasks || []);
    const projects = await projectRepo.upsertAll(userId, fullPlan.projects || []);
    await brandRepo.upsert(userId, fullPlan.brandAnalysis);
    await linkedinRepo.upsert(userId, fullPlan.linkedinGuidance);

    console.log(`[AI Orchestrator] Successfully saved complete career plan for user ${userId}!`);

    res.json({
      success: true,
      message: 'Career assessment completed and personalized growth plan generated.',
      snapshot: fullPlan.snapshot,
      careerDNA: fullPlan.careerDNA,
      skillAnalysis: fullPlan.skillAnalysis,
      roadmap: fullPlan.roadmap,
      projects,
      brandAnalysis: fullPlan.brandAnalysis,
      linkedinGuidance: fullPlan.linkedinGuidance
    });
  } catch (err) {
    console.error('Assessment orchestration error:', err);
    if (err.code === 'INVALID_API_KEY') {
      return res.status(502).json({ error: `Your career plan could not be generated because the AI is not configured correctly. ${err.message}` });
    }
    res.status(500).json({
      error: 'We could not generate your career plan right now. Please try again in a moment.'
    });
  }
});

module.exports = router;
