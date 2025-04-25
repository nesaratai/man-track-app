const mongoose = require('mongoose');


// create schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  emailaddress: {
    type: String
  },
  dob: {
    type: Date
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// create and export model
module.exports = mongoose.model('User', userSchema);