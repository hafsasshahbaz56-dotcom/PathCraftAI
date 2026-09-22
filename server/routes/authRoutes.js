const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepo, profileRepo } = require('../db/repository');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await userRepo.create({
      name,
      email,
      password_hash,
      subscription_status: 'free'
    });

    const userId = user.id || user._id.toString();

    // Create default profile
    await profileRepo.upsert(userId, {
      career_stage: 'Exploring',
      career_goals: 'Seeking career clarity and high-growth opportunities'
    });

    const token = jwt.sign({ id: userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        subscription_status: user.subscription_status
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userId = user.id || user._id.toString();
    const token = jwt.sign({ id: userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        subscription_status: user.subscription_status || 'free'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// Current user info
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// Update subscription status (Free / Pro)
router.put('/subscription', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['free', 'pro'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "free" or "pro".' });
    }

    const updated = await userRepo.updateSubscription(req.user.id, status);
    res.json({
      message: `Subscription successfully updated to ${status.toUpperCase()}.`,
      user: {
        id: req.user.id,
        name: updated.name,
        email: updated.email,
        subscription_status: updated.subscription_status
      }
    });
  } catch (err) {
    console.error('Subscription update error:', err);
    res.status(500).json({ error: 'Failed to update subscription.' });
  }
});

module.exports = router;
