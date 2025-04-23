
// bring dotenv in
const dotenv = require("dotenv"); // require package
dotenv.config();
// bring express in
const express = require('express');
// load express
const app = express();
// bring mongoose in
const mongoose = require("mongoose");
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override');
const port = process.env.PORT ? process.env.PORT : '3001';

// connect to mongoose
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

  
// import models
const User = require('./models/user.js')
const Project = require('./models/project.js')
const Task = require('./models/task.js')

// import auth controllers
const authController = require('./controllers/auth.js')


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
// new
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);





// render the home page
app.get("/", async (req, res) => {
    res.render("index.ejs",{
    user: req.session.user,
    });
  });


app.use("/auth", authController);



app.listen(port, () => {
  console.log(`The app is ready on port ${port}!`);
});