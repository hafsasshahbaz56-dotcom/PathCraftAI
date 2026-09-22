const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  subscription_status: { type: String, enum: ['free', 'pro'], default: 'free' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Profile Schema
const ProfileSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  career_stage: { type: String, default: '' },
  education: { type: String, default: '' },
  experience: { type: String, default: '' },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  career_goals: { type: String, default: '' },
  target_industry: { type: String, default: '' },
  work_style: { type: String, default: '' },
  learning_time: { type: String, default: '' },
  aspirations: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Assessment Schema
const AssessmentSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  answers: { type: mongoose.Schema.Types.Mixed, default: {} },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Career DNA Schema
const CareerDNASchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  career_direction: { type: String, default: '' },
  goals: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  skill_gaps: { type: [String], default: [] },
  experience: { type: String, default: '' },
  interests: { type: [String], default: [] },
  career_stage: { type: String, default: '' },
  target_industry: { type: String, default: '' },
  learning_preferences: { type: String, default: '' },
  brand_direction: { type: String, default: '' },
  content_direction: { type: String, default: '' },
  professional_goals: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Skill Analysis Schema
const SkillAnalysisSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  strong_skills: { type: [String], default: [] },
  developing_skills: { type: [String], default: [] },
  missing_skills: { type: [String], default: [] },
  priority_skills: { type: [String], default: [] },
  recommended_next_skill: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Roadmap Task subschema
const RoadmapTaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  week: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  skill: { type: String, default: '' },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  created_at: { type: Date, default: Date.now }
});

// Roadmap Schema
const RoadmapSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  duration: { type: Number, default: 30 },
  roadmap_data: { type: [RoadmapTaskSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  user_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, default: 'Beginner' },
  objective: { type: String, default: '' },
  skills: { type: [String], default: [] },
  tools: { type: [String], default: [] },
  steps: { type: [String], default: [] },
  expected_outcome: { type: String, default: '' },
  portfolio_description: { type: String, default: '' },
  linkedin_content_idea: { type: String, default: '' },
  career_relevance: { type: String, default: '' },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Brand Analysis Schema
const BrandAnalysisSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  current_positioning: { type: String, default: '' },
  target_positioning: { type: String, default: '' },
  gaps: { type: [String], default: [] },
  recommendations: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// LinkedIn Guidance Schema
const LinkedInGuidanceSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  headline: { type: String, default: '' },
  about: { type: String, default: '' },
  positioning: { type: String, default: '' },
  content_topics: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Chat Conversation Schema
const ChatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const ChatConversationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, index: true },
  messages: { type: [ChatMessageSchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  Profile: mongoose.models.Profile || mongoose.model('Profile', ProfileSchema),
  Assessment: mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema),
  CareerDNA: mongoose.models.CareerDNA || mongoose.model('CareerDNA', CareerDNASchema),
  SkillAnalysis: mongoose.models.SkillAnalysis || mongoose.model('SkillAnalysis', SkillAnalysisSchema),
  Roadmap: mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema),
  Project: mongoose.models.Project || mongoose.model('Project', ProjectSchema),
  BrandAnalysis: mongoose.models.BrandAnalysis || mongoose.model('BrandAnalysis', BrandAnalysisSchema),
  LinkedInGuidance: mongoose.models.LinkedInGuidance || mongoose.model('LinkedInGuidance', LinkedInGuidanceSchema),
  ChatConversation: mongoose.models.ChatConversation || mongoose.model('ChatConversation', ChatConversationSchema)
};
