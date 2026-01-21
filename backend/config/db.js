/**
 * Database Configuration File (config/db.js)
 * 
 * WHAT IT DOES:
 * Connects our Express application to MongoDB using the Mongoose library.
 * 
 * WHY IT IS NEEDED:
 * Node.js applications need a way to communicate with database systems.
 * Mongoose acts as an ODM (Object Data Modeling) library that connects
 * Node.js with MongoDB and provides schema validation and helper methods.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect using the URI specified in .env
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_management_db');
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    // Optional fallback message to help students troubleshoot local MongoDB issues
    console.error('👉 Make sure your local MongoDB server is running or check your MONGO_URI in .env');
    // We do not crash the app immediately so error routes or fallback setups can report issue cleanly
  }
};

module.exports = connectDB;
