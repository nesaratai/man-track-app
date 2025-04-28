const express = require("express");
const router = express.Router();


const Task = require("../models/task.js");
const Project = require("../models/project.js");

// Route to show the form for creating a new task for a specific project
router.get('/add/:projectId', async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      res.render('tasks/new.ejs', { 
        project 
      });
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });

  // Route to show the edit page for a task
router.get('/edit/:taskId', async (req, res) => {
  try {
    // find the task by id
    const task = await Task.findById(req.params.taskId);
    // Render the edit view 
    res.render('tasks/edit.ejs', { 
      task 
    });
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
        // Associate task with the project
        project: project._id, 
      });
     // Save the task
     await task.save();
  

      // Push task into the projects task array
      project.tasks.push(task);
      // Save the project after adding task
      await project.save()
 
      // Redirect to the project detail page after adding the task
      res.redirect(`/project/${project._id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });

  // Route to handle updating the task
router.put('/tasks/:taskId', async (req, res) => {
  try {
    // Find the task by Id and update it with new data
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    // Save updated task
    await task.save();

    // Redirect back to the project page
    res.redirect(`/project/${project._id}`);
  } catch (error) {
    console.error(error);
    res.redirect('/project');
  }
});

// delet the task
router.delete('/:id', async (req, res) => {
    try {
      // Find the task by id and delete
      await Task.findByIdAndDelete(req.params.id);
      // Redirect to current project
      res.redirect(`/project/${project._id}`);
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });


module.exports = router;