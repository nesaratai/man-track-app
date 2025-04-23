const mongoose = require('mongoose');
//creat schema
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

// create model
const User = mongoose.model('User', userSchema);

//export model
module.exports = User;