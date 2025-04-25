const express = require("express");
const router = express.Router();

// call project model
const Project = require("../models/project.js");
// call user model
const User = require("../models/user.js")


// create a project
router.post("/", async (req, res) => {
    // find the current user
    const currentUser = await User.findById(req.session.user._id);
    // create the new project and link it to user
    const newProject = await Project.create({
        // spread the project data
        ...req.body,
        // add the userId field
        userId: currentUser._id
    });

    // save the project
    await newProject.save();

    // send the user back to the project list
    res.redirect("/project/")
});

// list all projects
router.get('/', async (req, res) => {
    try {
        // get projects from the database only for the current user
        const projects = await Project.find({
            userId: req.session.user._id
        }); 
        console.log(projects)
        // render the projects list for the current user
        res.render('projects/index.ejs', {
            projects
        });
    } catch (error) {
        console.log(error);
        // redirect to home page if there is an issue
        res.redirect('/');
    }
});


// routs to new page for projects
router.get('/addproject', (req, res) => {
    res.render('projects/new.ejs');
});

router.get('/:id', async (req, res) => {
    try {
        // find the project by id
        const project = await Project.findById(req.params.id);

        // render project view page
        res.render('projects/show.ejs', {
            project
        });
    } catch (error) {
        console.error(error);
        res.redirect('/project');
    }
});
// edit the project
router.get('/:id/edit', async (req, res) => {
    try {
        // Find the project by id
        const project = await Project.findById(req.params.id);
        // render edit page
        res.render('projects/edit.ejs', { project });
    } catch (error) {
        console.error(error);
        res.redirect('/project');
    }
});

//update the a project
router.put('/:id', async (req, res) => {
    try {
        await Project.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/project/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.redirect('/project');
    }
});

// delet the project
router.delete('/:id', async (req, res) => {
    try {
        //finde the project by id and delete
      await Project.findByIdAndDelete(req.params.id);
      // then redirect to project
      res.redirect('/project');
    } catch (error) {
      console.error(error);
      res.redirect('/project');
    }
  });


module.exports = router;