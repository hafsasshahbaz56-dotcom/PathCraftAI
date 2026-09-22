const express = require('express');
const { careerDnaRepo, profileRepo } = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

// GET Career DNA
router.get('/dna', requireAuth, async (req, res) => {
  try {
    const dna = await careerDnaRepo.getByUserId(req.user.id);
    const isPro = req.user.subscription_status === 'pro';

    res.json({
      dna: dna || null,
      isPro,
      proPreview: !isPro ? {
        message: 'Upgrade to Pro to unlock Advanced Career DNA Trait Benchmarks & Market Readiness Scores.'
      } : null
    });
  } catch (err) {
    console.error('Fetch Career DNA error:', err);
    res.status(500).json({ error: 'Failed to retrieve Career DNA.' });
  }
});

// GET Career Direction
router.get('/direction', requireAuth, async (req, res) => {
  try {
    const dna = await careerDnaRepo.getByUserId(req.user.id);
    if (!dna) {
      return res.json({ direction: null, message: 'Assessment not completed yet.' });
    }

    const directionData = {
      careerDirection: dna.career_direction || 'Technology & Digital Innovation',
      fitReasoning: `Based on your background in ${dna.experience || 'your field'} and interests in ${(dna.interests || []).join(', ') || 'modern tech'}, this direction offers high market leverage and synergy with your aspirations.`,
      supportingStrengths: (dna.skills || []).slice(0, 4),
      relevantInterests: dna.interests || [],
      careerConsiderations: [
        'High demand for practitioners who can blend domain fundamentals with AI tools.',
        'Requires hands-on proof through projects rather than credentials alone.',
        'Continuous sprint learning model aligns well with your available time commitment.'
      ],
      recommendedNextStep: `Focus on mastering ${dna.skill_gaps?.[0] || 'your core priority skill'} and commence your first practical portfolio project.`,
      guidanceNote: 'This is a recommended direction based on your profile inputs — a strategic guidance tool to empower your decision-making, not a rigid constraint.'
    };

    res.json({ direction: directionData });
  } catch (err) {
    console.error('Fetch Career Direction error:', err);
    res.status(500).json({ error: 'Failed to retrieve career direction.' });
  }
});

module.exports = router;
