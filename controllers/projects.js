const express = require("express");
const router = express.Router();


const Project = require("../models/project.js");

router.get('/', (req, res) => {
    res.render('projects/index.ejs');
});

router.get('/project', (req, res) => {
    res.render('projects/new.ejs');
});




module.exports = router;