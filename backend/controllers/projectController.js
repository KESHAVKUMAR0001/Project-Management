/**
 * Project Controller (controllers/projectController.js)
 * 
 * Handles Project CRUD operations and member management.
 */

const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// Get projects (Admin sees all; Regular users see owned + member projects)
const getProjects = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { $or: [{ owner: req.user._id }, { members: req.user._id }] };

    const projects = await Project.find(query)
      .populate('owner', 'name email role')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create a project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      owner: req.user._id,
      members: [req.user._id]
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { ...project.toObject(), tasks }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete project & its tasks
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add member to project
const addMember = async (req, res) => {
  try {
    const { email, userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let userToAdd;
    if (email) userToAdd = await User.findOne({ email: email.toLowerCase() });
    else if (userId) userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const alreadyMember = project.members.some(m => m.toString() === userToAdd._id.toString());
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove member from project
const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.owner.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Cannot remove project owner' });
    }

    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();

    await Task.updateMany(
      { project: project._id, assignedTo: userId },
      { $set: { assignedTo: null } }
    );

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
