const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

//convention to capitalize
const Post = require("./models/post");

const postsRoutes = require("./routes/posts");

//chain of middlewares (funnel send express & have different parts & each part does something different w/ the request)
const app = express();
//uses a new middleware on our app & on our request
//next() skips to next part of funnel^
// app.use((request, response, next) => {
//     console.log('first middleware');
//     //without the next() creates a time-out because it doesn't get a response
//     next();
// });

//                                                                             vv change from test to another name and database with this name will be created for you
mongoose
  .connect(
    "mongodb+srv://Lisonallie:2UN7QJe79IIs5vTV@angular-posts-4ssd5.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  //gives feedback in nodemon whether the database connected or not
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });

//returns a valid express middleware for parsing json data
//Definitely want this above our POST method & is nice before headers
app.use(bodyParser.json());

//parses a different kind of body
app.use(bodyParser.urlencoded({ extended: false }));

//one additional middleware that adds CORS header
app.use((request, response, next) => {
  //allow to access all resources
  response.setHeader("Access-Control-Allow-Origin", "*");
  //allow domains with a certain header
  //if it doesn't have these headers access will be blocked
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept"
  );
  //allows us to control which methods can be used to access our data
  //OPTIONS is a default request sent by the browser before sending the get/etc request to check if it's valid. must include
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  //continue to next middleware
  next();
});

//export this app
//exports the const & all the new middlewares we added to it
module.exports = app;
