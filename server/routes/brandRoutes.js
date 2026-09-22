const express = require('express');
const { brandRepo, linkedinRepo, careerDnaRepo, projectRepo } = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const brand = await brandRepo.getByUserId(req.user.id);
    const linkedin = await linkedinRepo.getByUserId(req.user.id);
    const isPro = req.user.subscription_status === 'pro';

    res.json({
      brand: brand || null,
      linkedin: linkedin || null,
      isPro,
      proFeatures: {
        fullLinkedInAudit: isPro,
        viralHookGenerators: isPro,
        weeklyContentCalendar: isPro
      }
    });
  } catch (err) {
    console.error('Fetch brand error:', err);
    res.status(500).json({ error: 'Failed to retrieve personal branding data.' });
  }
});

router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const dna = await careerDnaRepo.getByUserId(req.user.id);
    const projects = await projectRepo.getByUserId(req.user.id);

    if (!dna) {
      return res.status(400).json({ error: 'Please complete your assessment first.' });
    }

    const brandData = await AIService.analyzePersonalBrand(dna, projects || []);
    const savedBrand = await brandRepo.upsert(req.user.id, brandData);

    const linkedinData = await AIService.generateLinkedInGuidance(dna, brandData);
    const savedLinkedin = await linkedinRepo.upsert(req.user.id, linkedinData);

    res.json({
      message: 'Personal branding & LinkedIn guidance updated.',
      brand: savedBrand,
      linkedin: savedLinkedin
    });
  } catch (err) {
    console.error('Analyze brand error:', err);
    res.status(500).json({ error: 'Failed to analyze personal branding.' });
  }
});

module.exports = router;
