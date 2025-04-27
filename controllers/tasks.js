const express = require("express");
const router = express.Router();


const Task = require("../models/task.js");
const Project = require("../models/project.js");

// Route to show the form for creating a new task for a specific project
router.get('/add/:projectId', async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      res.render('tasks/new.ejs', { project });
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });

// Route to handle task creation
router.post('/:projectId', async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      const task = new Task({
        ...req.body,
        project: project._id, // Associate task with the project
      });
  
      // Save the task
      await task.save();
  
      // Redirect to the project detail page after adding the task
      res.redirect(`/project/${project._id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });

module.exports = router;