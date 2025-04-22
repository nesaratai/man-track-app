
// bring dotenv in
const dotenv = require("dotenv"); // require package
dotenv.config();
// bring express in
const express = require('express');
// load express
const app = express();
// bring mongoose in
const mongoose = require("mongoose");


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
  




// render the home page
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });


app.use("/auth", authController);



app.listen(port, () => {
  console.log(`The app is ready on port ${port}!`);
});