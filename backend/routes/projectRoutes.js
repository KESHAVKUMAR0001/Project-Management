/**
 * Project Routes (routes/projectRoutes.js)
 * 
 * WHAT IT DOES:
 * Routes for project management (CRUD, members, and project task endpoints).
 * 
 * WHY IT IS NEEDED:
 * Defines RESTful endpoint URLs for project resources.
 */

const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { createTask, getProjectTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All project routes require authentication

// Project CRUD
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Project Members Management
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

// Project Tasks Nested Endpoints
router.route('/:projectId/tasks')
  .get(getProjectTasks)
  .post(createTask);

module.exports = router;
