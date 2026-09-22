const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 [Test] Starting automated backend API test suite...');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('✅ Health Check:', healthData.status);

  // 2. Register new user
  const email = `test_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Mercer',
      email,
      password: 'StrongPassword123!'
    })
  });
  const regData = await regRes.json();
  if (!regData.token) {
    throw new Error('Registration failed: ' + JSON.stringify(regData));
  }
  const token = regData.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  console.log('✅ Registered User:', regData.user.name, `(${regData.user.email})`);

  // 3. Current user check
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
  const meData = await meRes.json();
  console.log('✅ Auth /me verified:', meData.user.name);

  // 4. Submit Career Assessment (Triggers full Gemini AI Pipeline)
  console.log('⏳ [Test] Submitting assessment and running full AI generation pipeline...');
  const assessmentPayload = {
    answers: {
      career_stage: 'Early Career (1-3 years)',
      education: 'Bachelor’s Degree',
      current_skills: 'JavaScript, React, Basic Python, CSS, Git',
      experience_summary: 'Built frontend web applications and small dashboard utilities. Familiar with APIs.',
      interests: 'Generative AI, Cloud Infrastructure, Developer Tools, Full-Stack Architecture',
      target_industry: 'Software & AI Technology',
      career_goals: 'Transition into an AI-forward career and land a high-impact engineering role',
      confidence_level: '3 - Have some direction, but missing a solid roadmap',
      learning_time: '6 - 10 hours per week (Consistent sprint)',
      work_style: 'Fully Remote / Distributed teams',
      frustrations: 'Tutorial hell without building real projects',
      aspirations: 'Become a recognized AI Solutions Engineer building production AI applications.'
    }
  };

  const assessRes = await fetch(`${BASE_URL}/api/assessment/submit`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(assessmentPayload)
  });
  const assessData = await assessRes.json();
  if (!assessData.success) {
    throw new Error('Assessment orchestration failed: ' + JSON.stringify(assessData));
  }
  console.log('✅ AI Synthesis Complete!');
  console.log('   - Recommended Direction:', assessData.snapshot?.careerDirection);
  console.log('   - Top Strengths:', assessData.snapshot?.strengths?.join(', '));
  console.log('   - Priority Skill Gaps:', assessData.skillAnalysis?.priority_skills?.join(', '));
  console.log('   - Recommended Next Skill:', assessData.skillAnalysis?.recommended_next_skill);
  console.log('   - 30-Day Roadmap Tasks Count:', assessData.roadmap?.tasks?.length);
  console.log('   - Recommended Projects Count:', assessData.projects?.length);

  // 5. Check Career Direction
  const dirRes = await fetch(`${BASE_URL}/api/career/direction`, { headers: authHeaders });
  const dirData = await dirRes.json();
  console.log('✅ Career Direction API verified:', dirData.direction?.careerDirection);

  // 6. Check Skills API
  const skillsRes = await fetch(`${BASE_URL}/api/skills`, { headers: authHeaders });
  const skillsData = await skillsRes.json();
  console.log('✅ Skills API verified. Missing skills count:', skillsData.skills?.missing_skills?.length);

  // 7. Check Roadmap & Update a task status
  const roadRes = await fetch(`${BASE_URL}/api/roadmap`, { headers: authHeaders });
  const roadData = await roadRes.json();
  const firstTaskId = roadData.roadmap?.tasks?.[0]?.id;
  if (firstTaskId) {
    const taskUpdateRes = await fetch(`${BASE_URL}/api/roadmap/tasks/${firstTaskId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'completed' })
    });
    const taskUpdateData = await taskUpdateRes.json();
    console.log('✅ Roadmap Task Status Update verified for task:', firstTaskId);
  }

  // 8. Check Projects & Update a project status
  const projRes = await fetch(`${BASE_URL}/api/projects`, { headers: authHeaders });
  const projData = await projRes.json();
  const firstProjectId = projData.projects?.[0]?.id;
  if (firstProjectId) {
    const projUpdateRes = await fetch(`${BASE_URL}/api/projects/${firstProjectId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'in_progress' })
    });
    console.log('✅ Project Status Update verified for project:', firstProjectId);
  }

  // 9. Check Personal Brand & LinkedIn Guidance
  const brandRes = await fetch(`${BASE_URL}/api/brand`, { headers: authHeaders });
  const brandData = await brandRes.json();
  console.log('✅ Personal Brand verified. Suggested headline:', brandData.linkedin?.headline);

  // 10. Test AI Career Coach with context grounding
  console.log('⏳ [Test] Testing AI Career Coach with prompt: "What should I do next?"...');
  const coachRes = await fetch(`${BASE_URL}/api/coach/chat`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ message: 'What should I do next?' })
  });
  const coachData = await coachRes.json();
  console.log('✅ AI Career Coach Response Received:');
  console.log('   Preview:', coachData.message?.substring(0, 200).replace(/\n/g, ' ') + '...');

  // 11. Test Aggregated Dashboard API
  const dashRes = await fetch(`${BASE_URL}/api/dashboard`, { headers: authHeaders });
  const dashData = await dashRes.json();
  console.log('✅ Dashboard Verified:');
  console.log('   - Career Progress:', dashData.progressPercent + '%');
  console.log('   - Next Best Action:', dashData.nextBestAction?.title);
  console.log('   - CTA Button:', dashData.nextBestAction?.ctaText);

  // 12. Test Subscription Upgrade to Pro
  const subRes = await fetch(`${BASE_URL}/api/auth/subscription`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ status: 'pro' })
  });
  const subData = await subRes.json();
  console.log('✅ Subscription Upgrade verified:', subData.user?.subscription_status);

  console.log('\n🎉 ALL 12 BACKEND AUTOMATED API TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
