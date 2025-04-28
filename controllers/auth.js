// Call express module
const express = require("express");
// Define router
const router = express.Router();
// Call bcrypt module
const bcrypt = require("bcrypt");
// Call user model
const User = require("../models/user.js");
// Sccess sign up 
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});
// Access sign in page
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});
// Sign out session
router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

  
// Creating a user
router.post('/sign-up', async (req, res) => {
    try {
      // Check if the username is already taken
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (userInDatabase) {
        return res.send('Username already taken.');
      }
    
      // The user name is not taken and check password matchs the confirm password
      if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm Password must match');
      }
    
      // Must hash the password before sending to the database
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
    
      // Create user
      await User.create(req.body);
      // Redirect to sign in page
      res.redirect('/auth/sign-in');
    } catch (error) {
      // If found error console log error and redirect to home page
      console.log(error);
      res.redirect('/');
    }
  });

  router.post('/sign-in', async (req, res) => {
    // Use try and catch for any errors
    try {
      // Get the user from the database
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (!userInDatabase) {
        return res.send('Login failed. Please try again.');
      }
    
      // The user exists and test the password with bcrypt
      const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      // If the password is not valid return login failed
      if (!validPassword) {
        return res.send('Login failed. Please try again.');
      }
    
      // There is a user AND they had the correct password. Time to make a session!
      // Avoid storing the password, even in hashed format, in the session
      // If there is other data you want to save to `req.session.user`, do so here!
      req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
      };
      // Save the session 
      req.session.save();
      // Redirect to home page
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

// Show profile using the logged-in user's data
router.get('/profile', async (req, res) => {
  try {
    // Get the user from the session using the user ID stored in the session
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.redirect('/');
    }
    // Redirect to profile page
    res.render('profile/show', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Show edit profile form
router.get('/profile/:id/edit', async (req, res) => {
  try {
    // Access the logged-in user's data
    const user = await User.findById(req.session.user._id); 
    if (!user) {
      return res.redirect('/');
    }
    // Redirect to edit form
    res.render('profile/edit', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Update profile info
router.put('/profile', async (req, res) => {
  // Pull the user info from req.body
  const { name, lastname, emailaddress, dob } = req.body;
  try {
    // Update the user info and save it.
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id, 
      { name, lastname, emailaddress, dob },
      { new: true }
    );
    // Redirect back to the profile page after updating
    res.redirect('/profile'); 
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
