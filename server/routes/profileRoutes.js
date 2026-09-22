const express = require('express');
const { profileRepo, careerDnaRepo } = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const profile = await profileRepo.getByUserId(req.user.id);
    res.json({ profile: profile || {} });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const {
      career_stage,
      education,
      experience,
      skills,
      interests,
      career_goals,
      target_industry,
      work_style,
      learning_time,
      aspirations,
      sync_career_dna = false
    } = req.body;

    const updated = await profileRepo.upsert(req.user.id, {
      career_stage,
      education,
      experience,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map(s => s.trim()) : []),
      career_goals,
      target_industry,
      work_style,
      learning_time,
      aspirations
    });

    // If user requested DNA re-synchronization
    if (sync_career_dna) {
      try {
        const dna = await AIService.generateCareerDNA({}, updated);
        await careerDnaRepo.upsert(req.user.id, dna);
      } catch (aiErr) {
        console.warn('AI DNA sync warning:', aiErr.message);
      }
    }

    res.json({ message: 'Profile updated successfully.', profile: updated });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
