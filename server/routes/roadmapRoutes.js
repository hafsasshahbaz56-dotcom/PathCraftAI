const express = require('express');
const { roadmapRepo, careerDnaRepo, skillRepo } = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const roadmap = await roadmapRepo.getByUserId(req.user.id);
    const isPro = req.user.subscription_status === 'pro';

    if (!roadmap || !roadmap.roadmap_data || roadmap.roadmap_data.length === 0) {
      return res.json({ roadmap: null, message: 'No roadmap generated yet.' });
    }

    const tasks = roadmap.roadmap_data;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Group tasks by week
    const weeks = {
      1: tasks.filter(t => t.week === 1),
      2: tasks.filter(t => t.week === 2),
      3: tasks.filter(t => t.week === 3),
      4: tasks.filter(t => t.week === 4)
    };

    res.json({
      roadmap: {
        duration: roadmap.duration || 30,
        tasks,
        weeks,
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
          progressPercent
        }
      },
      isPro,
      proPreview: {
        sixtyDayPlan: isPro ? 'Unlocked: Advanced Scaling & Specialization Sprint' : 'Locked (Upgrade to Pro)',
        ninetyDayPlan: isPro ? 'Unlocked: Capstone Launch & Industry Thought Leadership Sprint' : 'Locked (Upgrade to Pro)'
      }
    });
  } catch (err) {
    console.error('Fetch roadmap error:', err);
    res.status(500).json({ error: 'Failed to retrieve roadmap.' });
  }
});

router.put('/tasks/:taskId', requireAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be not_started, in_progress, or completed.' });
    }

    const updatedRoadmap = await roadmapRepo.updateTaskStatus(req.user.id, taskId, status);
    if (!updatedRoadmap) {
      return res.status(404).json({ error: 'Roadmap or task not found.' });
    }

    res.json({ message: 'Task status updated.', roadmap: updatedRoadmap });
  } catch (err) {
    console.error('Update task status error:', err);
    res.status(500).json({ error: 'Failed to update task status.' });
  }
});

router.post('/generate', requireAuth, async (req, res) => {
  try {
    const dna = await careerDnaRepo.getByUserId(req.user.id);
    const skills = await skillRepo.getByUserId(req.user.id);

    if (!dna) {
      return res.status(400).json({ error: 'Please complete your assessment first.' });
    }

    const newRoadmap = await AIService.generateRoadmap(dna, skills || {});
    await roadmapRepo.upsert(req.user.id, newRoadmap.duration || 30, newRoadmap.tasks || []);

    res.json({ message: 'Roadmap generated successfully.', roadmap: newRoadmap });
  } catch (err) {
    console.error('Generate roadmap error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

module.exports = router;
