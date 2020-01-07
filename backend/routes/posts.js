const express = require("express");
const multer = require("multer");

const PostController = require("../controllers/posts");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//show multer where to store things and how to store them
const storage = multer.diskStorage({
  //destination is a function which will be executed whenever multer tries to save a file
  destination: (request, file, callback) => {
    //throw error if one of the mimetypes is not what's entered
    //shoudl return null if we get a mimetype that's not part of this map
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid file extension");
    if (isValid) {
      error = null;
    }
    //      vvv if it gets an error
    //              vv where to store images, this path is seen relative to your server.js file
    callback(error, "backend/images");
  },
  //filename
  filename: (request, file, callback) => {
    //                          vv normalize this to get one name file, remove spaces replace by dashes
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    //                      vv get the extension matching the specified expected extensions
    //multer automatically gives us the mimetpe
    const extension = MIME_TYPE_MAP[file.mimetype];
    //                         vvv current timestamp
    callback(null, name + "-" + Date.now() + "." + extension);
  }
});

//ataches a middleware triggered for incoming post requests
//can add extra middleware before the function is executed
//                  vv multer will extract a single file from the incoming request & try to find it on an image property in the request body.
//            vv look at the path
// router.post("", multer({storage: storage}).single("image"), (request, response, next) => {
// add 2nd argument middleware after the path but before all the other logic to execute
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.createPost
);

//router.patch updates exisiting resource with new values, put replaces completely
router.patch(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.updatePost
);

//does something with the response from 1st next function
//also ends response writing stream & returns this response
router.get("", PostController.getPosts);

router.get("/:id", PostController.getSinglePost);

router.delete(
  "/:id",
  checkAuth,
  PostController.deletePost
);

module.exports = router;
