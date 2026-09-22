const jwt = require('jsonwebtoken');
const { userRepo } = require('../db/repository');

const JWT_SECRET = process.env.JWT_SECRET || 'career_ai_jwt_super_secure_key_2026_growth';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userRepo.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User account not found or session expired.' });
    }

    req.user = {
      id: user.id || user._id.toString(),
      email: user.email,
      name: user.name,
      subscription_status: user.subscription_status || 'free'
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

module.exports = { requireAuth, JWT_SECRET };
