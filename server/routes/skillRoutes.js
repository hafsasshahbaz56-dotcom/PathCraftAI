const express = require('express');
const { skillRepo, careerDnaRepo } = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const analysis = await skillRepo.getByUserId(req.user.id);
    const isPro = req.user.subscription_status === 'pro';

    res.json({
      skills: analysis || null,
      isPro,
      proFeatures: {
        unlocked: isPro,
        advancedSalaryBenchmarking: isPro ? 'Available' : 'Locked (Pro only)',
        deepDiveLearningPaths: isPro ? 'Available' : 'Locked (Pro only)'
      }
    });
  } catch (err) {
    console.error('Fetch skills error:', err);
    res.status(500).json({ error: 'Failed to retrieve skill gaps.' });
  }
});

router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const dna = await careerDnaRepo.getByUserId(req.user.id);
    if (!dna) {
      return res.status(400).json({ error: 'Please complete your assessment first to generate Career DNA.' });
    }

    const analysis = await AIService.analyzeSkillGaps(dna);
    const saved = await skillRepo.upsert(req.user.id, analysis);

    res.json({ message: 'Skill gap analysis updated.', skills: saved });
  } catch (err) {
    console.error('Analyze skills error:', err);
    res.status(500).json({ error: 'Failed to analyze skill gaps.' });
  }
});

module.exports = router;
