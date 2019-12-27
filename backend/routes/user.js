//implement login and signup routes
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/users");

const router = express.Router();

router.post("/signup", (request, response, next) => {
    //I want to create a new user & store it in the database
    const user = new User({
        email: request.body.email,
        //encrypt password (hash)
        
    })
});

module.exports = router;