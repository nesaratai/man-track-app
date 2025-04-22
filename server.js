
// bring dotenv in
const dotenv = require("dotenv"); // require package
dotenv.config();
// bring express in
const express = require('express');
// bring mongoose in
const mongoose = require("mongoose");
// connect to mongoose
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });


// load express
const app = express();


// render the home page
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });



app.listen(3000, () => {
  console.log('Listening on port 3000');
});