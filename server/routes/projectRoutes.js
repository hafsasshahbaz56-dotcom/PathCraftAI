const express = require('express');
const { projectRepo, careerDnaRepo, skillRepo } = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await projectRepo.getByUserId(req.user.id);
    const isPro = req.user.subscription_status === 'pro';

    res.json({
      projects: projects || [],
      isPro,
      proMessage: isPro ? null : 'Pro members get access to 5+ specialized enterprise-grade portfolio project blueprints.'
    });
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be not_started, in_progress, or completed.' });
    }

    const updated = await projectRepo.updateStatus(req.user.id, id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({ message: 'Project status updated.', project: updated });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

router.post('/recommend', requireAuth, async (req, res) => {
  try {
    const dna = await careerDnaRepo.getByUserId(req.user.id);
    const skills = await skillRepo.getByUserId(req.user.id);

    if (!dna) {
      return res.status(400).json({ error: 'Please complete your assessment first.' });
    }

    const data = await AIService.recommendProjects(dna, skills || {});
    const saved = await projectRepo.upsertAll(req.user.id, data.projects || []);

    res.json({ message: 'Project recommendations refreshed.', projects: saved });
  } catch (err) {
    console.error('Recommend projects error:', err);
    res.status(500).json({ error: 'Failed to generate project recommendations.' });
  }
});

module.exports = router;
