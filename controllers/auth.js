const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.js");

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

  
// creating a user
router.post('/sign-up', async (req, res) => {
    try {
      // check if the username is already taken
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (userInDatabase) {
        return res.send('Username already taken.');
      }
    
      // the user name is not taken and check password matchs the confirm password
      if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm Password must match');
      }
    
      // Must hash the password before sending to the database
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
    
      // create user
      await User.create(req.body);
      // redirect to sign in page
      res.redirect('/auth/sign-in');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

  router.post('/sign-in', async (req, res) => {
    // use try and catch for any errors
    try {
      // get the user from the database
      const userInDatabase = await User.findOne({ username: req.body.username });
      if (!userInDatabase) {
        return res.send('Login failed. Please try again.');
      }
    
      // the user exists and test the password with bcrypt
      const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      // if the password is not valid return login failed
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
      // save the session 
      req.session.save();

      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });


module.exports = router;
