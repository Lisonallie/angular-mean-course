const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

//convention to capitalize
const Post = require("./models/post");

//chain of middlewares (funnel send express & have different parts & each part does something different w/ the request)
const app = express();
//uses a new middleware on our app & on our request
//next() skips to next part of funnel^
// app.use((request, response, next) => {
//     console.log('first middleware');
//     //without the next() creates a time-out because it doesn't get a response
//     next();
// });

//                                                                                          vv change from test to another name and database with this name will be created for you
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

//ataches a middleware triggered for incoming post requests
app.post("/api/posts", (request, response, next) => {
  //store posts from database here
  //check if getting data to that route works
  //posts have a request body so they have data attached to them --install extra package which is convenience middleware which automatically extracts incoming request data & adds it to a new field on that request object where we can conveniently access it
  //node express package, parses incoming request bodies, extracts the request data stream & converts it to data object we can use, then re-adds it on a special property to the request object.
  // old code: const post = request.body;
  const post = new Post({
    title: request.body.title,
    content: request.body.content
  });
  //save method provided by mongoose package for every model created with it
  //automatically created the right query for the database & injects it into db
  // name of collection always the plural name of your model name. in our case: Post so it's posts. mongoose does it for you
  post.save();
  //typical status code for everything is ok, new resource was created
  response.status(201).json({
    message: "post added"
  });
  //can't add next() here because we are already sending a response so would get an error
});

//does something with the response from 1st next function
//also ends response writing stream & returns this response
app.get("/api/posts", (request, response, next) => {
  //Want to fetch data from the posts collection
  Post.find().then(documents => {
    //can send posts or a more complicated method::
    response.status(200).json({
      message: "posts fetched successfully!",
      posts: documents
    });
  });
  //   const posts = [
  //     {
  //       id: "fad12421l",
  //       title: "first server-side post",
  //       content: "this is coming from the server"
  //     },

  //     {
  //       id: "ksajflaj132",
  //       title: "second server-side post",
  //       content: "this is coming from the server!"
  //     }
  //   ];
  //response.send('hello friend');
});

//                      vv able to access id property here
app.delete("/api/posts/:id", (request, response, next) => {
    Post.deleteOne({ _id: request.params.id }).then(result => {
        console.log(result);
        response.status(200).json({message: 'Post deleted'});
    });
});

//export this app
//exports the const & all the new middlewares we added to it
module.exports = app;
