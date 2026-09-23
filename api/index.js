// Vercel serverless entry point.
// All /api/* requests are rewritten to this function (see vercel.json) and
// handled by the shared Express app exported from server/server.js.
const app = require('../server/server.js');

module.exports = app;
