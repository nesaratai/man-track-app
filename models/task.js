const mongoose = require('mongoose');

// create schema
const taskSchema = mongoose.Schema({
    ProjectName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    Type: [{
        type: String,
        enum: ['Task','Issue']
      }],
    ReportedDate: {
        type: Date
    },
    DueDate: {
        type: Date
    },
    Status: {
        type: String,
        enum: ['Pending', 'In Progress','Completed'],
        default: 'Pending',
    },
    Description: {
        type: String
    },
    Notes: {
        type: String
    }
});

// create a model
const Task = mongoose.model('Task', taskSchema);

//export model
module.exports = Task;