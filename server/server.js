const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, getIsMongoConnected } = require('./db/connection');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const careerRoutes = require('./routes/careerRoutes');
const skillRoutes = require('./routes/skillRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const projectRoutes = require('./routes/projectRoutes');
const brandRoutes = require('./routes/brandRoutes');
const coachRoutes = require('./routes/coachRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows Vite dev scripts and inline fonts
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });
}

// Ensure the database connection is established before handling requests.
// On serverless (Vercel) the module is reused across invocations, so the
// connection promise is cached and only created once per warm instance.
let dbConnectionPromise = null;
const ensureDB = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
};

app.use(async (req, res, next) => {
  try {
    await ensureDB();
  } catch (err) {
    console.error('[Database] ensureDB error:', err.message);
  }

  // The local JSON file store cannot persist across Vercel serverless
  // invocations (read-only, ephemeral filesystem), so silently using it in
  // production produces "user not found" right after registration. Surface a
  // clear error instead of pretending the request succeeded.
  if (process.env.VERCEL && !getIsMongoConnected() && req.path.startsWith('/api') && req.path !== '/api/health') {
    return res.status(503).json({
      error: 'The database is currently unavailable. Please verify MONGODB_URI (it must include the user password and a database name) and that "Allow access from anywhere" (0.0.0.0/0) is enabled in MongoDB Atlas Network Access.'
    });
  }

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI Career Growth Platform V1'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static frontend build when running as a standalone server (local/prod
// node process). On Vercel the static client is served by the CDN and only
// /api/* requests reach this function, so these handlers are simply unused.
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>AI Career Growth Platform</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2>AI Career Growth Platform API is Live</h2>
            <p>Backend is operating on port ${PORT}. Run <code>npm run dev:client</code> to launch the frontend.</p>
          </body>
        </html>
      `);
    }
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'An internal server error occurred. Please try again.'
  });
});

// Start a real HTTP listener only when this file is run directly
// (e.g. `node server/server.js`). When imported by the Vercel serverless
// entry (api/index.js), the app is exported and invoked per request instead.
if (require.main === module) {
  ensureDB().finally(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` AI Career Growth Platform API Running on Port ${PORT}`);
      console.log(` Base URL: http://localhost:${PORT}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  });
}

module.exports = app;
