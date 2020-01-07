const Post = require("../models/post");

exports.createPost = (request, response, next) => {
  //store posts from database here
  //check if getting data to that route works
  //posts have a request body so they have data attached to them --install extra package which is convenience middleware which automatically extracts incoming request data & adds it to a new field on that request object where we can conveniently access it
  //node express package, parses incoming request bodies, extracts the request data stream & converts it to data object we can use, then re-adds it on a special property to the request object.
  // old code: const post = request.body;
  //                  vv assesses whether accessing the server with http or https
  const url = request.protocol + "://" + request.get("host");
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    //                                    vv provided by multer
    imagePath: url + "/images/" + request.file.filename,
    // pass new creator field created in post model, fetch userID from the token in user routes
    //we verify token in check-auth middleware, which returns a result of the decoded token
    creator: request.userData.userId
  });
  //save method provided by mongoose package for every model created with it
  //automatically created the right query for the database & injects it into db
  // name of collection always the plural name of your model name. in our case: Post so it's posts. mongoose does it for you
  post
    .save()
    .then(createdPost => {
      response.status(201).json({
        message: "post added",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
          creator: createdPost.creator
          //same thing vvvvv
          // ...createdPost,
          // id: createdPost._id
        }
      });
    })
    .catch(error => {
      response.status(500).json({
        message: "Creating a post failed"
      });
    });
  //typical status code for everything is ok, new resource was created
  //can't add next() here because we are already sending a response so would get an error
};

exports.updatePost = (request, response, next) => {
  console.log(request.file);
  let imagePath = request.body.imagePath;
  if (request.file) {
    const url = request.protocol + "://" + request.get("host");
    imagePath = url + "/images/" + request.file.filename;
  }
  const post = new Post({
    //need _id or it tries to make a new post with a new id
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
    imagePath: imagePath,
    creator: request.userData.userId
  });
  //Post capital is post model
  //               vv with underscore because it's still stored that way in the database and we're in the backend
  //                    vvv id encoded in the URL
  //                                                                            vvv this post is the post const we just declared within the function
  //                                                  vvv make sure user who edits post is the one who created it
  Post.updateOne(
    { _id: request.params.id, creator: request.userData.userId },
    post
  )
    .then(result => {
      // if we did update the post
      // n was nModified, old code
      if (result.n > 0) {
        response.status(200).json({ message: "Update successful" });
      } else {
        response.status(401).json({ message: "Not authorized" });
      }
    })
    .catch(error => {
      response.status(500).json({
        message: "Couldn't update post"
      });
    });
};

exports.getPosts = (request, response, next) => {
  // w/ query parameters you can add extra info to the end of your url, separated by question mark
  //console.log(request.query);
  //               vv normally this returns a string but if you add a + it returns a number!!
  const pageSize = +request.query.pagesize;
  const currentPage = +request.query.page;
  const postQuery = Post.find();
  //store documents from 1st then block in a variable so I can use them in the 2nd then block
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      //not retrieve all posts but will skip the first end posts
      //want to not show posts based on which page we are on
      // if you were on page 2 then you want to skip all items that were displayed on page 1
      // items displayed on page 1 are: pagesize (2) * (currentpage[2] - 1) = 2 x 1 so we skip 2 items
      .skip(pageSize * (currentPage - 1))
      //narrow down the amount of documents we retrieve for the currentpage
      //limits the amount of documents we return
      //limit field must always be numeric
      .limit(pageSize);
  }
  //Want to fetch data from the posts collection
  //old code   Post.find()
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      //              vv counts all results
      return Post.count();
    })
    .then(count => {
      //can send posts or a more complicated method::
      response.status(200).json({
        message: "posts fetched successfully!",
        // documents are the items from database
        posts: fetchedPosts,
        // # of posts we have in the database in total (found from count method)
        maxPosts: count
      });
    })
    .catch(error => {
      response.status(500).json({
        message: "Fetching posts failed"
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
};

exports.getSinglePost = (request, response, next) => {
  //reach out to database and find post with that id
  //Post capital is post model
  Post.findById(request.params.id)
    .then(post => {
      if (post) {
        //returning post from database
        response.status(200).json(post);
      } else {
        response.status(404).json({ message: "post not found" });
      }
    })
    .catch(error => {
      response.status(500).json({
        message: "Fetching post failed"
      });
    });
};

exports.deletePost = // vv able to access id property here
(request, response, next) => {
  Post.deleteOne({ _id: request.params.id, creator: request.userData.userId }).then(result => {
    if(result.n> 0) {
      response.status(200).json({ message: "Post deleted" });
    } else {
      response.status(401).json({ message: "Not authorized" });
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Fetching posts failed"
    })
  });
}
