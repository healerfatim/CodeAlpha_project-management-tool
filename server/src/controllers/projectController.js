const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id] // Owner is automatically a member
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    // Find projects where the user is a member
    const projects = await Project.find({ members: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects };