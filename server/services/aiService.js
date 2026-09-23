const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

async function callGemini(contents, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  // A real Google Gemini key is ~39 chars and starts with "AIza". Reject
  // missing keys and obvious placeholders instead of firing a doomed request.
  if (!apiKey || apiKey.length < 20) {
    const e = new Error('GEMINI_API_KEY is missing or invalid. Provide a real Google Gemini API key (starts with "AIza", ~39 characters) in your Vercel project environment variables.');
    e.code = 'INVALID_API_KEY';
    throw e;
  }

  const { json = true, systemInstruction = null, temperature = 0.4 } = options;

  const payload = {
    contents,
    generationConfig: {
      temperature,
      ...(json ? { responseMimeType: 'application/json' } : {})
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[Gemini API] ${model} HTTP ${res.status}: ${errorText.substring(0, 180)}`);
        // Auth failures are not model-specific — fail fast with a clear cause
        // instead of silently masking them behind fabricated fallback content.
        if (res.status === 400 && /API_?KEY_?INVALID|API key not valid/i.test(errorText)) {
          const e = new Error('GEMINI_API_KEY was rejected by Google (API_KEY_INVALID). Set a valid key in your Vercel environment variables.');
          e.code = 'INVALID_API_KEY';
          throw e;
        }
        if (res.status === 401 || res.status === 403) {
          const e = new Error(`GEMINI_API_KEY unauthorized (HTTP ${res.status}). Verify the key and that the Generative Language API is enabled for it.`);
          e.code = 'INVALID_API_KEY';
          throw e;
        }
        lastError = new Error(`Gemini HTTP ${res.status}: ${errorText.substring(0, 150)}`);
        continue; // Transient/model-specific issue — try next model in pool
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No text returned from Gemini candidate');
      }

      if (json) {
        try {
          return JSON.parse(text);
        } catch (parseErr) {
          const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          return JSON.parse(clean);
        }
      }

      return text;
    } catch (err) {
      if (err.code === 'INVALID_API_KEY') throw err; // don't retry a bad key
      lastError = err;
      console.warn(`[Gemini API] Model ${model} error:`, err.message);
    }
  }

  throw lastError || new Error("Failed to communicate with AI provider.");
}

// Deterministic persona fallback if Gemini cloud has a temporary 503 demand spike
function generateDeterministicFallback(answers = {}, profile = {}) {
  const target = answers.target_industry || profile.target_industry || 'Software & AI Technology';
  const role = target.includes('Marketing') ? 'AI Growth Marketing Strategist' :
               target.includes('Design') ? 'AI Product & UX Designer' :
               target.includes('Data') ? 'Data & Applied AI Engineer' : 'Full-Stack AI Solutions Engineer';

  const nextSkill = target.includes('Marketing') ? 'AI Analytics & Campaign Automation' :
                    target.includes('Design') ? 'AI Prototyping & Generative Design Systems' : 'LLM APIs & Vector Databases';

  return {
    snapshot: {
      careerDirection: role,
      fitReasoning: `Based on your interest in ${target} and goal to ${answers.career_goals || 'accelerate your career'}, this path leverages modern AI tools for maximum market relevance.`,
      strengths: ['Analytical Problem Solving', 'Fast Technical Execution', 'Strategic Growth Mindset'],
      skillGaps: ['Production AI APIs', 'System Architecture', 'Portfolio Proof'],
      recommendedNextSkill: nextSkill,
      brandDirection: `${role} | Building Intelligent Systems`,
      confidenceScore: 89
    },
    careerDNA: {
      career_direction: role,
      goals: [answers.career_goals || 'Land an AI-forward career role', 'Build demonstrable public projects'],
      skills: ['JavaScript', 'API Integration', 'Modern Web Technologies'],
      skill_gaps: [nextSkill, 'Cloud Deployment', 'Vector Embeddings'],
      experience: answers.experience_summary || '1-3 years of technical experience',
      interests: [target, 'Generative AI', 'High-Growth Tech'],
      career_stage: answers.career_stage || 'Early Career',
      target_industry: target,
      learning_preferences: answers.learning_time || '6-10 hours/week',
      brand_direction: `${role} | Modern Builder`,
      content_direction: 'AI tools, project teardowns, and modern technical workflows',
      professional_goals: answers.aspirations || 'Senior AI builder leading impactful applications'
    },
    skillAnalysis: {
      strong_skills: ['Frontend Fundamentals', 'Problem Decomposition', 'Continuous Learning'],
      developing_skills: ['API Architecture', 'Data Persistence', 'Prompt Engineering'],
      missing_skills: ['Production AI Pipelines', 'Vector Databases', 'Performance Profiling'],
      priority_skills: [nextSkill, 'LangChain/LlamaIndex', 'Cloud Functions', 'System Design'],
      recommended_next_skill: nextSkill,
      next_skill_rationale: 'Mastering this unlocks immediate ability to connect LLMs to real user interfaces.'
    },
    roadmap: {
      duration: 30,
      tasks: [
        {
          id: 'task_1',
          week: 1,
          title: `Foundations of ${nextSkill}`,
          description: 'Study core API endpoints, rate limiting, and structured JSON parsing with modern SDKs.',
          skill: nextSkill,
          status: 'not_started'
        },
        {
          id: 'task_2',
          week: 1,
          title: 'Environment & Token Setup',
          description: 'Configure secure server-side environment variables and token management.',
          skill: 'Security & Backend',
          status: 'not_started'
        },
        {
          id: 'task_3',
          week: 2,
          title: 'Practical Mini-Service Implementation',
          description: 'Build a standalone script that handles user prompts, validates schemas, and returns structured data.',
          skill: 'Applied AI',
          status: 'not_started'
        },
        {
          id: 'task_4',
          week: 3,
          title: 'Capstone Project Architecture',
          description: 'Scaffold the full-stack interface and connect dynamic state to your AI backend service.',
          skill: 'Full-Stack Architecture',
          status: 'not_started'
        },
        {
          id: 'task_5',
          week: 4,
          title: 'Portfolio Showcase & LinkedIn Launch',
          description: 'Document your project architecture, capture demo walk-throughs, and publish your case study on LinkedIn.',
          skill: 'Personal Branding',
          status: 'not_started'
        }
      ]
    },
    projects: [
      {
        id: 'proj_1',
        title: 'AI Content & Workflow Copilot',
        difficulty: 'Beginner',
        objective: 'Build an end-to-end intelligent assistant that synthesizes domain prompts into structured actions.',
        skills: ['AI APIs', 'Prompt Optimization', 'State Management'],
        tools: ['Gemini API', 'Node.js', 'React'],
        steps: [
          'Design prompt template with schema enforcement',
          'Implement server-side route with authentication',
          'Connect modern responsive frontend with live state',
          'Deploy and record a 60-second video demo'
        ],
        expected_outcome: 'A working full-stack SaaS application ready for public demonstration.',
        portfolio_description: 'Architected and deployed an AI copilot featuring real-time schema generation and responsive UI.',
        linkedin_content_idea: 'How I built an AI workflow copilot in 14 days and what I learned about structured prompting.',
        career_relevance: 'Demonstrates modern full-stack AI engineering beyond simple wrappers.',
        status: 'not_started'
      },
      {
        id: 'proj_2',
        title: 'Semantic Document Intelligence Engine',
        difficulty: 'Intermediate',
        objective: 'Ingest unstructured documentation and allow users to query it with grounded contextual citations.',
        skills: ['RAG', 'Vector Embeddings', 'Full-Stack'],
        tools: ['Node.js', 'Vector DB', 'Modern UI'],
        steps: [
          'Chunk and vectorize documentation into embeddings',
          'Perform cosine similarity matching on queries',
          'Inject context into model prompts',
          'Render citations in web dashboard'
        ],
        expected_outcome: 'A production-grade semantic search tool demonstrating real retrieval-augmented generation.',
        portfolio_description: 'Designed a contextual document query engine with source attribution and low latency.',
        linkedin_content_idea: 'Why naive prompting fails for enterprise docs and how retrieval systems solve hallucinations.',
        career_relevance: 'Essential knowledge for modern AI engineering and product roles.',
        status: 'not_started'
      }
    ],
    brandAnalysis: {
      current_positioning: 'Generalist with foundational skills looking for direction',
      target_positioning: `${role} known for delivering tangible, AI-augmented products`,
      gaps: [
        'Generic resume and LinkedIn summary lacking a clear AI specialization',
        'Absence of demonstrable, live-deployed portfolio projects',
        'Infrequent public sharing of technical learnings and insights'
      ],
      recommendations: [
        'Update LinkedIn headline to highlight your target direction and primary stack',
        'Publish a case study of your first portfolio project with a video demo',
        'Write 2 short technical takeaways per week sharing lessons learned while building',
        'Engage meaningfully with builders and hiring managers in your target domain'
      ]
    },
    linkedinGuidance: {
      headline: `${role} | Building Intelligent Web Systems & AI Workflows`,
      about: `I specialize in building intelligent, scalable digital solutions that bridge modern engineering with applied AI. Passionate about transforming complex workflows into clean, human-centered software.\n\nCurrently focused on full-stack architecture, structured AI APIs, and high-impact digital products. Always learning, building, and sharing insights along the journey.`,
      positioning: `${role} combining foundational technical execution with modern AI capabilities.`,
      content_topics: [
        'Lessons learned from building and deploying my first full-stack AI project',
        'Why structured JSON prompting is essential for production AI applications',
        'My 30-day sprint roadmap to transitioning into modern AI engineering',
        'Breakdown of top tools and libraries shaping the next generation of software'
      ]
    }
  };
}

const AIService = {
  /**
   * Master Orchestration: Synthesizes entire Career Plan in one cohesive call
   */
  async synthesizeFullCareerPlan(answers, profile = {}) {
    const prompt = `
You are a world-class AI Career Strategist and Talent Diagnostic Engine.
Given the following user assessment and profile:
${JSON.stringify({ answers, profile }, null, 2)}

Provide a unified, highly cohesive Career Plan strictly adhering to the "Assess -> Understand -> Diagnose -> Plan -> Build -> Brand -> Grow" philosophy.
The advice must be non-dogmatic ("Recommended direction", "Potential fit", "Consider exploring"). Never guarantee jobs or claim certainty.

Respond ONLY with valid JSON matching this exact schema:
{
  "snapshot": {
    "careerDirection": "string",
    "fitReasoning": "string (2-3 sentences)",
    "strengths": ["string", "string", "string"],
    "skillGaps": ["string", "string", "string"],
    "recommendedNextSkill": "string",
    "brandDirection": "string",
    "confidenceScore": 88
  },
  "careerDNA": {
    "career_direction": "string",
    "goals": ["string", "string"],
    "skills": ["string", "string", "string"],
    "skill_gaps": ["string", "string", "string"],
    "experience": "string",
    "interests": ["string", "string"],
    "career_stage": "string",
    "target_industry": "string",
    "learning_preferences": "string",
    "brand_direction": "string",
    "content_direction": "string",
    "professional_goals": "string"
  },
  "skillAnalysis": {
    "strong_skills": ["string", "string"],
    "developing_skills": ["string", "string"],
    "missing_skills": ["string", "string"],
    "priority_skills": ["string", "string", "string"],
    "recommended_next_skill": "string",
    "next_skill_rationale": "string"
  },
  "roadmap": {
    "duration": 30,
    "tasks": [
      {
        "id": "task_1",
        "week": 1,
        "title": "string",
        "description": "string",
        "skill": "string",
        "status": "not_started"
      },
      {
        "id": "task_2",
        "week": 1,
        "title": "string",
        "description": "string",
        "skill": "string",
        "status": "not_started"
      },
      {
        "id": "task_3",
        "week": 2,
        "title": "string",
        "description": "string",
        "skill": "string",
        "status": "not_started"
      },
      {
        "id": "task_4",
        "week": 3,
        "title": "string",
        "description": "string",
        "skill": "string",
        "status": "not_started"
      },
      {
        "id": "task_5",
        "week": 4,
        "title": "string",
        "description": "string",
        "skill": "string",
        "status": "not_started"
      }
    ]
  },
  "projects": [
    {
      "id": "proj_1",
      "title": "string",
      "difficulty": "Beginner",
      "objective": "string",
      "skills": ["string", "string"],
      "tools": ["string", "string"],
      "steps": ["Step 1", "Step 2", "Step 3"],
      "expected_outcome": "string",
      "portfolio_description": "string",
      "linkedin_content_idea": "string",
      "career_relevance": "string",
      "status": "not_started"
    },
    {
      "id": "proj_2",
      "title": "string",
      "difficulty": "Intermediate",
      "objective": "string",
      "skills": ["string", "string"],
      "tools": ["string", "string"],
      "steps": ["Step 1", "Step 2", "Step 3"],
      "expected_outcome": "string",
      "portfolio_description": "string",
      "linkedin_content_idea": "string",
      "career_relevance": "string",
      "status": "not_started"
    }
  ],
  "brandAnalysis": {
    "current_positioning": "string",
    "target_positioning": "string",
    "gaps": ["string", "string", "string"],
    "recommendations": ["string", "string", "string", "string"]
  },
  "linkedinGuidance": {
    "headline": "string",
    "about": "string",
    "positioning": "string",
    "content_topics": ["string", "string", "string"]
  }
}
`;

    try {
      const plan = await callGemini([{ parts: [{ text: prompt }] }], { json: true });
      if (plan && plan.snapshot && plan.careerDNA && plan.skillAnalysis) {
        return plan;
      }
      throw new Error("Malformed plan returned from Gemini");
    } catch (err) {
      // A misconfigured key must surface as a real error, never as a generic
      // template that looks personalized but isn't.
      if (err.code === 'INVALID_API_KEY') throw err;
      console.warn('[AIService] Transient Gemini issue, using contextual fallback:', err.message);
      return generateDeterministicFallback(answers, profile);
    }
  },

  /**
   * Standalone Generators for individual feature updates
   */
  async generateCareerSnapshot(answers, profile = {}) {
    const plan = await this.synthesizeFullCareerPlan(answers, profile);
    return plan.snapshot;
  },

  async generateCareerDNA(answers, profile = {}, snapshot = {}) {
    const plan = await this.synthesizeFullCareerPlan(answers, profile);
    return plan.careerDNA;
  },

  async analyzeSkillGaps(careerDNA) {
    const prompt = `Analyze skill gaps for: ${JSON.stringify(careerDNA)}. Respond in JSON with strong_skills, developing_skills, missing_skills, priority_skills, recommended_next_skill, next_skill_rationale.`;
    try {
      return await callGemini([{ parts: [{ text: prompt }] }], { json: true });
    } catch (e) {
      return generateDeterministicFallback({ target_industry: careerDNA.target_industry }).skillAnalysis;
    }
  },

  async generateRoadmap(careerDNA, skillAnalysis) {
    const prompt = `Generate a 30-day 4-week roadmap for: ${careerDNA.career_direction}. Priority skills: ${JSON.stringify(skillAnalysis.priority_skills)}. Respond in JSON with duration: 30, tasks: [{ id, week, title, description, skill, status: "not_started" }]`;
    try {
      return await callGemini([{ parts: [{ text: prompt }] }], { json: true });
    } catch (e) {
      return generateDeterministicFallback({ target_industry: careerDNA.target_industry }).roadmap;
    }
  },

  async recommendProjects(careerDNA, skillAnalysis) {
    const prompt = `Recommend 2 projects following Learn -> Build -> Prove for: ${careerDNA.career_direction}. Respond in JSON with projects: [{ id, title, difficulty, objective, skills, tools, steps, expected_outcome, portfolio_description, linkedin_content_idea, career_relevance, status: "not_started" }]`;
    try {
      return await callGemini([{ parts: [{ text: prompt }] }], { json: true });
    } catch (e) {
      return { projects: generateDeterministicFallback({ target_industry: careerDNA.target_industry }).projects };
    }
  },

  async analyzePersonalBrand(careerDNA, projects = []) {
    const prompt = `Analyze personal brand for: ${careerDNA.career_direction}. Respond in JSON with current_positioning, target_positioning, gaps, recommendations.`;
    try {
      return await callGemini([{ parts: [{ text: prompt }] }], { json: true });
    } catch (e) {
      return generateDeterministicFallback({ target_industry: careerDNA.target_industry }).brandAnalysis;
    }
  },

  async generateLinkedInGuidance(careerDNA, brandAnalysis) {
    const prompt = `Generate LinkedIn guidance for: ${careerDNA.career_direction}. Respond in JSON with headline, about, positioning, content_topics.`;
    try {
      return await callGemini([{ parts: [{ text: prompt }] }], { json: true });
    } catch (e) {
      return generateDeterministicFallback({ target_industry: careerDNA.target_industry }).linkedinGuidance;
    }
  },

  /**
   * Conversational AI Career Coach
   */
  async chatWithCareerCoach(careerContext, chatHistory, userMessage) {
    const systemPrompt = `
You are the user's dedicated AI Career Coach.
You provide strategic, pragmatic, encouraging, and highly actionable career guidance.

CRITICAL PRODUCT PRINCIPLE:
Every response should answer or lead toward: "What should I do next?"
Always prioritize actionable guidance over generic platitudes.
When the user asks "What should I do?" or has limited time (e.g. 5 hours), use their specific roadmap tasks and priority skills to recommend concrete next steps.

SAFETY & INTEGRITY RULES:
- Never guarantee a job, income, or certain outcome.
- Base your advice firmly on the user's saved context.
- Frame suggestions as guidance: "I recommend focusing on...", "A great next step would be...", "Based on your Career DNA...".

USER SAVED CAREER CONTEXT:
- Career Direction: ${careerContext.careerDirection || 'Exploring tech career'}
- Career DNA Summary: ${JSON.stringify(careerContext.careerDNA || {})}
- Priority Skill Gaps: ${JSON.stringify(careerContext.prioritySkills || [])}
- Next Recommended Skill: ${careerContext.nextSkill || 'Core fundamentals'}
- Current Roadmap Focus: ${JSON.stringify(careerContext.currentRoadmapTask || 'Week 1 foundational tasks')}
- Recommended Projects: ${JSON.stringify(careerContext.projects || [])}
- Personal Brand Target: ${careerContext.brandTarget || 'Not yet defined'}
`;

    const contents = [];
    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory.slice(-8)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.message }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      return await callGemini(contents, {
        json: false,
        systemInstruction: systemPrompt,
        temperature: 0.6
      });
    } catch (err) {
      // Never return a canned string here — that produced the "same answer to
      // every question" symptom. Surface the real failure to the route.
      console.error('[AIService] Gemini coach call failed:', err.message);
      throw err;
    }
  }
};

module.exports = AIService;
