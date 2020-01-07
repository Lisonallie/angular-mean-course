const express = require("express");

const PostController = require("../controllers/posts");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/extract-file");


//ataches a middleware triggered for incoming post requests
//can add extra middleware before the function is executed
//                  vv multer will extract a single file from the incoming request & try to find it on an image property in the request body.
//            vv look at the path
// router.post("", multer({storage: storage}).single("image"), (request, response, next) => {
// add 2nd argument middleware after the path but before all the other logic to execute ((((multer.js middleware))))
router.post(
  "",
  checkAuth,
  extractFile,
  PostController.createPost
);

//router.patch updates exisiting resource with new values, put replaces completely
router.patch(
  "/:id",
  checkAuth,
  extractFile,
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
