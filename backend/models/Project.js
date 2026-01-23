/**
 * Project Model (models/Project.js)
 * 
 * WHAT IT DOES:
 * Defines the MongoDB schema for Projects.
 * 
 * WHY IT IS NEEDED:
 * Represents a project created by a user. Each project has an owner (the creator)
 * and an array of member user references who can collaborate on the project.
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  // The creator/owner of the project
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Members who are part of this project
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
