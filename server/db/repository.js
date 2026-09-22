const fs = require('fs');
const path = require('path');
const { getIsMongoConnected } = require('./connection');
const models = require('./models');

// File-based persistence setup for robust fallback
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'career_store.json');

function initLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      users: [],
      profiles: [],
      assessments: [],
      career_dna: [],
      skill_analysis: [],
      roadmaps: [],
      projects: [],
      brand_analysis: [],
      linkedin_guidance: [],
      chat_conversations: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function readStore() {
  initLocalStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local data store:', e);
    return { users: [], profiles: [], assessments: [], career_dna: [], skill_analysis: [], roadmaps: [], projects: [], brand_analysis: [], linkedin_guidance: [], chat_conversations: [] };
  }
}

function writeStore(data) {
  try {
    initLocalStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing local data store:', e);
  }
}

// User Repository
const userRepo = {
  async findByEmail(email) {
    if (getIsMongoConnected()) {
      return await models.User.findOne({ email: email.toLowerCase() }).lean();
    }
    const db = readStore();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id) {
    if (getIsMongoConnected()) {
      return await models.User.findById(id).lean();
    }
    const db = readStore();
    return db.users.find(u => u.id === id || u._id === id) || null;
  },

  async create({ name, email, password_hash, subscription_status = 'free' }) {
    const now = new Date();
    if (getIsMongoConnected()) {
      const user = new models.User({ name, email: email.toLowerCase(), password_hash, subscription_status, created_at: now, updated_at: now });
      const saved = await user.save();
      return saved.toObject();
    }
    const db = readStore();
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const user = { id, _id: id, name, email: email.toLowerCase(), password_hash, subscription_status, created_at: now, updated_at: now };
    db.users.push(user);
    writeStore(db);
    return user;
  },

  async updateSubscription(userId, status) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.User.findByIdAndUpdate(userId, { subscription_status: status, updated_at: now }, { new: true }).lean();
    }
    const db = readStore();
    const user = db.users.find(u => u.id === userId || u._id === userId);
    if (user) {
      user.subscription_status = status;
      user.updated_at = now;
      writeStore(db);
    }
    return user;
  }
};

// Profile Repository
const profileRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.Profile.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.profiles.find(p => p.user_id === userId) || null;
  },

  async upsert(userId, data) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.Profile.findOneAndUpdate(
        { user_id: userId },
        { ...data, user_id: userId, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.profiles.findIndex(p => p.user_id === userId);
    const profile = { ...(index >= 0 ? db.profiles[index] : {}), ...data, user_id: userId, updated_at: now };
    if (index >= 0) db.profiles[index] = profile;
    else { profile.created_at = now; db.profiles.push(profile); }
    writeStore(db);
    return profile;
  }
};

// Assessment Repository
const assessmentRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.Assessment.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.assessments.find(a => a.user_id === userId) || null;
  },

  async save(userId, answers, completed = false) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.Assessment.findOneAndUpdate(
        { user_id: userId },
        { answers, completed, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.assessments.findIndex(a => a.user_id === userId);
    const assessment = { ...(index >= 0 ? db.assessments[index] : {}), user_id: userId, answers, completed, updated_at: now };
    if (index >= 0) db.assessments[index] = assessment;
    else { assessment.created_at = now; db.assessments.push(assessment); }
    writeStore(db);
    return assessment;
  }
};

// Career DNA Repository
const careerDnaRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.CareerDNA.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.career_dna.find(c => c.user_id === userId) || null;
  },

  async upsert(userId, data) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.CareerDNA.findOneAndUpdate(
        { user_id: userId },
        { ...data, user_id: userId, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.career_dna.findIndex(c => c.user_id === userId);
    const dna = { ...(index >= 0 ? db.career_dna[index] : {}), ...data, user_id: userId, updated_at: now };
    if (index >= 0) db.career_dna[index] = dna;
    else { dna.created_at = now; db.career_dna.push(dna); }
    writeStore(db);
    return dna;
  }
};

// Skill Analysis Repository
const skillRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.SkillAnalysis.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.skill_analysis.find(s => s.user_id === userId) || null;
  },

  async upsert(userId, data) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.SkillAnalysis.findOneAndUpdate(
        { user_id: userId },
        { ...data, user_id: userId, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.skill_analysis.findIndex(s => s.user_id === userId);
    const analysis = { ...(index >= 0 ? db.skill_analysis[index] : {}), ...data, user_id: userId, updated_at: now };
    if (index >= 0) db.skill_analysis[index] = analysis;
    else { analysis.created_at = now; db.skill_analysis.push(analysis); }
    writeStore(db);
    return analysis;
  }
};

// Roadmap Repository
const roadmapRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.Roadmap.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.roadmaps.find(r => r.user_id === userId) || null;
  },

  async upsert(userId, duration, tasks) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.Roadmap.findOneAndUpdate(
        { user_id: userId },
        { duration, roadmap_data: tasks, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.roadmaps.findIndex(r => r.user_id === userId);
    const roadmap = { user_id: userId, duration, roadmap_data: tasks, updated_at: now };
    if (index >= 0) db.roadmaps[index] = roadmap;
    else { roadmap.created_at = now; db.roadmaps.push(roadmap); }
    writeStore(db);
    return roadmap;
  },

  async updateTaskStatus(userId, taskId, status) {
    const now = new Date();
    if (getIsMongoConnected()) {
      const roadmap = await models.Roadmap.findOne({ user_id: userId });
      if (!roadmap) return null;
      const task = roadmap.roadmap_data.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        roadmap.updated_at = now;
        await roadmap.save();
      }
      return roadmap.toObject();
    }
    const db = readStore();
    const roadmap = db.roadmaps.find(r => r.user_id === userId);
    if (roadmap && roadmap.roadmap_data) {
      const task = roadmap.roadmap_data.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        roadmap.updated_at = now;
        writeStore(db);
      }
    }
    return roadmap;
  }
};

// Project Repository
const projectRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.Project.find({ user_id: userId }).sort({ created_at: -1 }).lean();
    }
    const db = readStore();
    return db.projects.filter(p => p.user_id === userId);
  },

  async upsertAll(userId, projectList) {
    const now = new Date();
    if (getIsMongoConnected()) {
      await models.Project.deleteMany({ user_id: userId });
      const docs = projectList.map(p => ({
        ...p,
        id: p.id || 'proj_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        status: p.status || 'not_started',
        created_at: now,
        updated_at: now
      }));
      return await models.Project.insertMany(docs);
    }
    const db = readStore();
    db.projects = db.projects.filter(p => p.user_id !== userId);
    const saved = projectList.map(p => ({
      ...p,
      id: p.id || 'proj_' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      status: p.status || 'not_started',
      created_at: now,
      updated_at: now
    }));
    db.projects.push(...saved);
    writeStore(db);
    return saved;
  },

  async updateStatus(userId, projectId, status) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.Project.findOneAndUpdate(
        { user_id: userId, id: projectId },
        { status, updated_at: now },
        { new: true }
      ).lean();
    }
    const db = readStore();
    const proj = db.projects.find(p => p.user_id === userId && p.id === projectId);
    if (proj) {
      proj.status = status;
      proj.updated_at = now;
      writeStore(db);
    }
    return proj;
  }
};

// Brand Analysis Repository
const brandRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.BrandAnalysis.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.brand_analysis.find(b => b.user_id === userId) || null;
  },

  async upsert(userId, data) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.BrandAnalysis.findOneAndUpdate(
        { user_id: userId },
        { ...data, user_id: userId, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.brand_analysis.findIndex(b => b.user_id === userId);
    const brand = { ...(index >= 0 ? db.brand_analysis[index] : {}), ...data, user_id: userId, updated_at: now };
    if (index >= 0) db.brand_analysis[index] = brand;
    else { brand.created_at = now; db.brand_analysis.push(brand); }
    writeStore(db);
    return brand;
  }
};

// LinkedIn Guidance Repository
const linkedinRepo = {
  async getByUserId(userId) {
    if (getIsMongoConnected()) {
      return await models.LinkedInGuidance.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.linkedin_guidance.find(l => l.user_id === userId) || null;
  },

  async upsert(userId, data) {
    const now = new Date();
    if (getIsMongoConnected()) {
      return await models.LinkedInGuidance.findOneAndUpdate(
        { user_id: userId },
        { ...data, user_id: userId, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    const index = db.linkedin_guidance.findIndex(l => l.user_id === userId);
    const linkedin = { ...(index >= 0 ? db.linkedin_guidance[index] : {}), ...data, user_id: userId, updated_at: now };
    if (index >= 0) db.linkedin_guidance[index] = linkedin;
    else { linkedin.created_at = now; db.linkedin_guidance.push(linkedin); }
    writeStore(db);
    return linkedin;
  }
};

// Chat Repository
const chatRepo = {
  async getConversation(userId) {
    if (getIsMongoConnected()) {
      return await models.ChatConversation.findOne({ user_id: userId }).lean();
    }
    const db = readStore();
    return db.chat_conversations.find(c => c.user_id === userId) || { user_id: userId, messages: [] };
  },

  async appendMessage(userId, role, message) {
    const now = new Date();
    const msgId = 'msg_' + Math.random().toString(36).substr(2, 9);
    const newMsg = { id: msgId, role, message, created_at: now };

    if (getIsMongoConnected()) {
      return await models.ChatConversation.findOneAndUpdate(
        { user_id: userId },
        { $push: { messages: newMsg }, updated_at: now },
        { upsert: true, new: true }
      ).lean();
    }
    const db = readStore();
    let conv = db.chat_conversations.find(c => c.user_id === userId);
    if (!conv) {
      conv = { user_id: userId, messages: [], created_at: now, updated_at: now };
      db.chat_conversations.push(conv);
    }
    conv.messages.push(newMsg);
    conv.updated_at = now;
    writeStore(db);
    return conv;
  }
};

module.exports = {
  userRepo,
  profileRepo,
  assessmentRepo,
  careerDnaRepo,
  skillRepo,
  roadmapRepo,
  projectRepo,
  brandRepo,
  linkedinRepo,
  chatRepo
};
