const express = require('express');
const {
  chatRepo,
  careerDnaRepo,
  skillRepo,
  roadmapRepo,
  projectRepo,
  brandRepo,
  profileRepo
} = require('../db/repository');
const { requireAuth } = require('../middleware/auth');
const AIService = require('../services/aiService');

const router = express.Router();

// GET conversation history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const conv = await chatRepo.getConversation(req.user.id);
    const isPro = req.user.subscription_status === 'pro';

    res.json({
      messages: conv?.messages || [],
      isPro,
      messageCount: conv?.messages?.length || 0
    });
  } catch (err) {
    console.error('Fetch chat history error:', err);
    res.status(500).json({ error: 'Failed to retrieve coach conversation history.' });
  }
});

// POST message to AI Career Coach
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const userId = req.user.id;
    const isPro = req.user.subscription_status === 'pro';

    // Check message limit for Free users
    const conv = await chatRepo.getConversation(userId);
    const userMsgCount = (conv?.messages || []).filter(m => m.role === 'user').length;
    if (!isPro && userMsgCount >= 20) {
      return res.status(403).json({
        error: 'Free tier message limit reached (20 messages). Upgrade to Pro for unlimited coaching conversations.',
        proGate: true
      });
    }

    // Gather complete contextual intelligence
    const [profile, dna, skills, roadmap, projects, brand] = await Promise.all([
      profileRepo.getByUserId(userId),
      careerDnaRepo.getByUserId(userId),
      skillRepo.getByUserId(userId),
      roadmapRepo.getByUserId(userId),
      projectRepo.getByUserId(userId),
      brandRepo.getByUserId(userId)
    ]);

    // Find current active roadmap task
    const activeTask = roadmap?.roadmap_data?.find(t => t.status !== 'completed') || null;

    const careerContext = {
      careerDirection: dna?.career_direction || profile?.career_goals || 'Tech Specialist',
      careerDNA: dna || {},
      prioritySkills: skills?.priority_skills || [],
      nextSkill: skills?.recommended_next_skill || 'Core Technical Foundations',
      currentRoadmapTask: activeTask ? `${activeTask.title} (Week ${activeTask.week}): ${activeTask.description}` : 'Week 1 foundational learning',
      projects: (projects || []).map(p => ({ title: p.title, status: p.status, difficulty: p.difficulty })),
      brandTarget: brand?.target_positioning || dna?.brand_direction || ''
    };

    // Save user message
    await chatRepo.appendMessage(userId, 'user', message.trim());

    // Generate response using Gemini
    const aiResponse = await AIService.chatWithCareerCoach(careerContext, conv?.messages || [], message.trim());

    // Save coach response
    await chatRepo.appendMessage(userId, 'assistant', aiResponse);

    res.json({
      role: 'assistant',
      message: aiResponse,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('AI Coach error:', err);
    res.status(500).json({
      error: "We couldn't reach your AI Career Coach right now. Please try again in a moment."
    });
  }
});

module.exports = router;
