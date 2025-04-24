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
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // reference to the User model
        ref: 'User'  
      }
});

// create a model and export it
module.exports = mongoose.model('Project', projectSchema);

