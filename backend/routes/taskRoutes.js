/**
 * Task Routes (routes/taskRoutes.js)
 */

const express = require('express');
const router = express.Router();
const { getMyTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my-tasks', getMyTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
