const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require('../controllers/taskController');

// All routes are protected and require authentication
router.use(protect);

// Task routes
router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/toggle')
  .patch(toggleTaskStatus);

module.exports = router;
