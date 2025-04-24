
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
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const methodOverride = require('method-override');
const projectRouter = require('./controllers/projects.js')
const taskRouter = require('./controllers/tasks.js')



const port = process.env.PORT ? process.env.PORT : '3001';
const MongoStore = require("connect-mongo");

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




// render the home page
app.get("/", async (req, res) => {
    res.render("index.ejs",{
    user: req.session.user,
    });
  });


app.use("/auth", authController);
app.use(isSignedIn);
app.use("/project/", projectRouter);
app.use("/task/", taskRouter);

app.listen(port, () => {
  console.log(`The app is ready on port ${port}!`);
});