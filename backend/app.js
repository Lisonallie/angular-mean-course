const express = require("express");

const bodyParser = require("body-parser");
//chain of middlewares (funnel send express & have different parts & each part does something different w/ the request)
const app = express();
//uses a new middleware on our app & on our request
//next() skips to next part of funnel^
// app.use((request, response, next) => {
//     console.log('first middleware');
//     //without the next() creates a time-out because it doesn't get a response
//     next();
// });


//returns a valid express middleware for parsing json data
//Definitely want this above our POST method & is nice before headers
app.use(bodyParser.json());

//parses a different kind of body
app/this.use(bodyParser.urlencoded({ extended: false }))

//one additional middleware that adds CORS header
app.use((request, response, next) => {
  //allow to access all resources
  response.setHeader("Access-Control-Allow-Origin", "*");
  //allow domains with a certain header
  //if it doesn't have these headers access will be blocked
  response.setHeader(
    "Access-Control-Allow-Header",
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
  const post = request.body;
  console.log(post);
  //typical status code for everything is ok, new resource was created
  response.status(201).json({
      message: 'post added'
  });
});

//does something with the response from 1st next function
//also ends response writing stream & returns this response
app.use("/api/posts", (request, response, next) => {
  const posts = [
    {
      id: "fad12421l",
      title: "first server-side post",
      content: "this is coming from the server"
    },

    {
      id: "ksajflaj132",
      title: "second server-side post",
      content: "this is coming from the server!"
    }
  ];
  //can send posts or a more complicated method::
  response.status(200).json({
    message: "posts fetched successfully!",
    posts: posts
  });
  //response.send('hello friend');
});

//export this app
//exports the const & all the new middlewares we added to it
module.exports = app;
