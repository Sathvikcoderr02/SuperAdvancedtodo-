const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, status = 'pending', dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (task) {
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
exports.toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Toggle task status error:', error);
    res.status(500).json({ message: 'Server error while toggling task status' });
  }
};
