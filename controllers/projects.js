const express = require("express");
// Define router
const router = express.Router();

// Call project model
const Project = require("../models/project.js");
// Call user model
const User = require("../models/user.js")


// Create a project
router.post("/", async (req, res) => {
    // Find the current user
    const currentUser = await User.findById(req.session.user._id);
    // Create the new project and link it to user
    const newProject = await Project.create({
        // Spread the project data
        ...req.body,
        // Add the userId field
        userId: currentUser._id
    });

    // Save the project
    await newProject.save();

    // Send the user back to the project list
    res.redirect("/project/")
});

// List all projects
router.get('/', async (req, res) => {
    try {
        // Get projects from the database only for the current user
        const projects = await Project.find({
            userId: req.session.user._id
        }); 
        // Render the projects list for the current user
        res.render('projects/index.ejs', {
            projects
        });
    } catch (error) {
        console.log(error);
        // Redirect to home page if there is an error
        res.redirect('/');
    }
});


// Routs to new page for projects
router.get('/addproject', (req, res) => {
    res.render('projects/new.ejs');
});
// Get all projects and associated tasks
router.get('/:id', async (req, res) => {
    try {
        // Find the project by id
        const project = await Project.findById(req.params.id).populate('tasks');

        // Render project view page
        res.render('projects/show.ejs', {
            project
        });
    } catch (error) {
        console.error(error);
        res.redirect('/project');
    }
});
// Edit the project
router.get('/:id/edit', async (req, res) => {
    try {
        // Find the project by id
        const project = await Project.findById(req.params.id);
        // Render edit page
        res.render('projects/edit.ejs', { project });
    } catch (error) {
        console.error(error);
        res.redirect('/project');
    }
});

// Update the project
router.put('/:id', async (req, res) => {
    try {
        // Find the Project by Id, update and save it
        await Project.findByIdAndUpdate(req.params.id, req.body);
        // Redirect to current project
        res.redirect(`/project/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.redirect('/project');
    }
});

// Delet the project
router.delete('/:id', async (req, res) => {
    try {
        // Find the project by id and delete
      await Project.findByIdAndDelete(req.params.id);
      // Redirect to project page
      res.redirect('/project');
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });


module.exports = router;