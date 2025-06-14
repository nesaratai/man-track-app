
// bring dotenv in
const dotenv = require("dotenv"); // require package
dotenv.config();
// bring express in
const express = require('express');
// load express
const app = express();
// bring apps in
const mongoose = require("mongoose");
const morgan = require('morgan')
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const methodOverride = require('method-override');
const projectRouter = require('./controllers/projects.js')
const taskRouter = require('./controllers/tasks.js')
const path = require('path');


const port = process.env.PORT ? process.env.PORT : '3001';
const MongoStore = require("connect-mongo");

// Connect to mongoose
mongoose.connect(process.env.MONGODB_URI);
// Log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

  
// Import models
const User = require('./models/user.js')
const Project = require('./models/project.js')
const Task = require('./models/task.js')

// Import auth controllers
const authController = require('./controllers/auth.js')

// Set up EJS
app.set('view engine', 'ejs');



// Middleware
app.use(express.urlencoded({ extended: false }));

// Method Override
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
  }),
}));
app.use(passUserToView); 




// Render the home page
app.get('/', async (req, res) => {
  try {
    let userProjects = [];
    // If signed in, find all projects created by the user 
    if (req.session.user) {
      userProjects = await Project.find({ createdBy: req.session.user._id });
    }
    // Find all projects in the database
    const allProjects = await Project.find();
    //Find all tasks, and sort them
    const tasks = await Task.find().sort({ ReportedDate: -1 });
     // Send all data to home page to view
    res.render('index', {
      user: req.session.user,
      userProjects,
      allProjects,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.redirect('/auth/sign-in');
  }
});

app.use("/auth", authController);
app.use("/", authController);
app.use(isSignedIn);
app.use("/project/", projectRouter);
app.use("/task/", taskRouter);

app.listen(port, () => {
  console.log(`The app is ready on port ${port}!`);
});