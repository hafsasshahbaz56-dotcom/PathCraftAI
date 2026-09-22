const express = require('express');
const {
  careerDnaRepo,
  skillRepo,
  roadmapRepo,
  projectRepo,
  brandRepo,
  assessmentRepo
} = require('../db/repository');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [assessment, dna, skills, roadmap, projects, brand] = await Promise.all([
      assessmentRepo.getByUserId(userId),
      careerDnaRepo.getByUserId(userId),
      skillRepo.getByUserId(userId),
      roadmapRepo.getByUserId(userId),
      projectRepo.getByUserId(userId),
      brandRepo.getByUserId(userId)
    ]);

    // Check if user has completed assessment
    if (!assessment || !assessment.completed) {
      return res.json({
        hasCompletedAssessment: false,
        message: 'Career assessment not yet completed.',
        nextBestAction: {
          title: 'Discover Your Career Direction & Roadmap',
          description: 'Take our 5-minute intelligent assessment to receive your Career DNA, custom 30-day plan, and portfolio projects.',
          ctaText: 'Start Career Assessment',
          ctaLink: '/assessment',
          type: 'assessment'
        }
      });
    }

    // Calculate Roadmap & Project Progress
    const tasks = roadmap?.roadmap_data || [];
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length || 1;
    const projectList = projects || [];
    const completedProjects = projectList.filter(p => p.status === 'completed').length;
    const totalProjects = projectList.length || 1;

    // Weighted progress: 60% roadmap, 40% projects
    const roadmapScore = (completedTasks / totalTasks) * 60;
    const projectScore = (completedProjects / totalProjects) * 40;
    const progressPercent = Math.min(100, Math.round(roadmapScore + projectScore));

    // Determine current active task
    const activeTask = tasks.find(t => t.status === 'in_progress') || tasks.find(t => t.status === 'not_started') || null;

    // Determine active recommended project
    const activeProject = projectList.find(p => p.status === 'in_progress') || projectList.find(p => p.status === 'not_started') || projectList[0] || null;

    // Formulate the Next Best Action
    let nextBestAction;
    if (activeProject && activeProject.status === 'in_progress') {
      nextBestAction = {
        title: `Continue Project: ${activeProject.title}`,
        description: `You are currently building ${activeProject.title}. Complete this project to showcase tangible proof in your portfolio.`,
        ctaText: 'Continue Project',
        ctaLink: '/projects',
        type: 'project'
      };
    } else if (activeTask) {
      nextBestAction = {
        title: `Week ${activeTask.week} Sprint: ${activeTask.title}`,
        description: activeTask.description || `Focus on mastering ${activeTask.skill} to stay on schedule.`,
        ctaText: 'Open 30-Day Roadmap',
        ctaLink: '/roadmap',
        type: 'roadmap'
      };
    } else if (activeProject) {
      nextBestAction = {
        title: `Kickstart Portfolio Project: ${activeProject.title}`,
        description: activeProject.objective || 'Start your recommended project to build verifiable skills.',
        ctaText: 'Start Project',
        ctaLink: '/projects',
        type: 'project'
      };
    } else {
      nextBestAction = {
        title: 'Review Personal Brand & LinkedIn Positioning',
        description: 'Position yourself for opportunities with AI-crafted headlines and content themes.',
        ctaText: 'View Personal Brand',
        ctaLink: '/brand',
        type: 'brand'
      };
    }

    res.json({
      hasCompletedAssessment: true,
      careerDirection: dna?.career_direction || 'AI & Digital Professional',
      confidenceScore: dna?.confidence_score || 88,
      progressPercent,
      currentFocus: activeProject?.title ? `Building ${activeProject.title}` : (activeTask?.title || 'Learning Core Fundamentals'),
      skillSummary: {
        prioritySkills: skills?.priority_skills || [],
        recommendedNextSkill: skills?.recommended_next_skill || 'Core Technical Foundations',
        missingCount: skills?.missing_skills?.length || 0
      },
      brandSummary: {
        currentPositioning: brand?.current_positioning || 'Emerging Talent',
        targetPositioning: brand?.target_positioning || dna?.brand_direction || 'Modern Tech Professional',
        gapsCount: brand?.gaps?.length || 3
      },
      roadmapSummary: {
        duration: roadmap?.duration || 30,
        currentWeek: activeTask ? activeTask.week : 1,
        completedTasks,
        totalTasks: tasks.length
      },
      recommendedProject: activeProject,
      nextBestAction
    });
  } catch (err) {
    console.error('Fetch dashboard error:', err);
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics.' });
  }
});

module.exports = router;
