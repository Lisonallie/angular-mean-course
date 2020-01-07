//implement login and signup routes
const express = require("express");
const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.createUser);

//create another route that checks for token

router.post("/login", UserController.userLogin);

module.exports = router;
