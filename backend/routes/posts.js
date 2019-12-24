const express = require("express");

const router = express.Router();
const Post = require("../models/post");

//ataches a middleware triggered for incoming post requests
router.post("", (request, response, next) => {
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

//router.patch updates exisiting resource with new values, put replaces completely
router.patch("/:id", (request, response, next) => {
  const post = new Post({
    //need _id or it tries to make a new post with a new id
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content
  });
  //Post capital is post model
  //               vv with underscore because it's still stored that way in the database and we're in the backend
  //                    vvv id encoded in the URL
  //                                        vvv this post is the post const we just declared within the function
  Post.updateOne({ _id: request.params.id }, post).then(result => {
    response.status(200).json({ message: "update successful" });
  });
});

//does something with the response from 1st next function
//also ends response writing stream & returns this response
router.get("", (request, response, next) => {
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

router.get("/:id", (request, response, next) => {
  //reach out to database and find post with that id
  //Post capital is post model
  Post.findById(request.params.id).then(post => {
    if (post) {
      //returning post from database
      response.status(200).json(post);
    } else {
      response.status(404).json({ message: "post not found" });
    }
  });
});

//                      vv able to access id property here
router.delete("/:id", (request, response, next) => {
  Post.deleteOne({ _id: request.params.id }).then(result => {
    console.log(result);
    response.status(200).json({ message: "Post deleted" });
  });
});

module.exports = router;
