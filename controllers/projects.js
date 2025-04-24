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

    //save the project
    await newProject.save();

    // send the user back to the project list
    res.redirect("/project/")
});

// list project
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




module.exports = router;