const mongoose = require('mongoose');

// create schema
const projectSchema = mongoose.Schema({
    CompanyName: {
        type: String
    },
    ProjectName:{
        type: String
    },
    StartDate: {
        type: Date
    },
    DueDate: {
        type: Date
    },
    Description: {
        type: String
    },
    Notes: {
        type: String
    }
});

// create a model
const Project = mongoose.model('Project', projectSchema);

//export model
module.exports = Project;