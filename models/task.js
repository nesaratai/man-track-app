const mongoose = require('mongoose');

// create schema
const taskSchema = mongoose.Schema({
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