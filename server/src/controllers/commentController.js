const Comment = require('../models/Comment');

// @desc    Add a comment to a task
// @route   POST /api/comments
const createComment = async (req, res) => {
  try {
    const { text, taskId } = req.body;
    const comment = await Comment.create({
      text,
      task: taskId,
      user: req.user._id
    });
    
    // Populate the user data so the frontend can display the user's name
    const populatedComment = await comment.populate('user', 'name email');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for a specific task
// @route   GET /api/comments/:taskId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId }).populate('user', 'name');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getComments };