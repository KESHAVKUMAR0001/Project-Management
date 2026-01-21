/**
 * User Model (models/User.js)
 * 
 * WHAT IT DOES:
 * Defines the MongoDB schema structure for Users in our system.
 * 
 * WHY IT IS NEEDED:
 * Mongoose schemas define the fields, data types, validation rules, and default values 
 * for documents stored in the database collections.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Token stored when user logs in, used to issue new access tokens
  refreshToken: {
    type: String,
    default: null
  },
  // Used for Forgot / Reset Password feature
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
