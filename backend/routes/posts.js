const express = require("express");
const multer = require('multer');

const router = express.Router();
const Post = require("../models/post");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

//show multer where to store things and how to store them
const storage = multer.diskStorage({
  //destination is a function which will be executed whenever multer tries to save a file
  destination: (request, file, callback) => {
    //throw error if one of the mimetypes is not what's entered
    //shoudl return null if we get a mimetype that's not part of this map
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid file extension');
    if (isValid) {
      error = null;
    }
    //      vvv if it gets an error
    //              vv where to store images, this path is seen relative to your server.js file
    callback(null, "backend/images");
  },
  //filename
  filename: (request, file, callback) => {
    //                          vv normalize this to get one name file, remove spaces replace by dashes
    const name = file.originalname.toLowerCase().split(' ').join('-');
    //                      vv get the extension matching the specified expected extensions
    //multer automatically gives us the mimetpe
    const extension = MIME_TYPE_MAP[file.mimetype];
    //                         vvv current timestamp
    callback(null, name +'-' + Date.now() + '.' + extension);
  }
});

//ataches a middleware triggered for incoming post requests
//can add extra middleware before the function is executed
//              vv multer will extract a single file from the incoming request & try to find it on an image property in the request body.
router.post("", multer({storage: storage}).single("image"), (request, response, next) => {
  //store posts from database here
  //check if getting data to that route works
  //posts have a request body so they have data attached to them --install extra package which is convenience middleware which automatically extracts incoming request data & adds it to a new field on that request object where we can conveniently access it
  //node express package, parses incoming request bodies, extracts the request data stream & converts it to data object we can use, then re-adds it on a special property to the request object.
  // old code: const post = request.body;
  //                  vv assesses whether accessing the server with http or https
  const url = request.protocol + '://' + request.get('host');
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    //                                    vv provided by multer
    imagePath: url + "/images/" + request.file.filename
  });
  //save method provided by mongoose package for every model created with it
  //automatically created the right query for the database & injects it into db
  // name of collection always the plural name of your model name. in our case: Post so it's posts. mongoose does it for you
  post.save();
  //typical status code for everything is ok, new resource was created
  response.status(201).json({
    message: "post added",
    post: {
      //old code
      // id: createdPost._id,
      // title: createdPost.title,
      // content: createdPost.content,
      // imagePath: createdPost.imagePath
      //same thing vvvvv
      ...createdPost,
      id: createdPost._id
    }
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
      // documents are the items from database
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
