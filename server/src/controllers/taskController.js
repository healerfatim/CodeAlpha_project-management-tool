const Task = require('../models/Task');

// @desc    Create a task inside a project
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, projectId, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      project: projectId,
      assignedTo: assignedTo || req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/:projectId
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status (e.g., drag and drop)
// @route   PUT /api/tasks/:id
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true } // Returns the updated document
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus };