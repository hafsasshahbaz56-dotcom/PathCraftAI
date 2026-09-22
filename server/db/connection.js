const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] No MONGODB_URI provided. Using local persistent store.');
    return false;
  }

  try {
    console.log('[Database] Connecting to MongoDB Atlas...');
    // Set 5s timeout to not hang server if password or IP whitelist is pending
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('[Database] Successfully connected to MongoDB Atlas!');
    return true;
  } catch (err) {
    console.warn('[Database] MongoDB connection warning:', err.message);
    console.warn('[Database] Note: Ensure database username and password are provided in MONGODB_URI.');
    console.log('[Database] Activated persistent local repository fallback (all features remain 100% functional).');
    isMongoConnected = false;
    return false;
  }
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = { connectDB, getIsMongoConnected };
