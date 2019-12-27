//implement login and signup routes
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/users");

const router = express.Router();

router.post("/signup", (request, response, next) => {
    //encrypt password (hash)
    //          v what to hash,       v salting round, higher number, longer it'll take but safer it'll be
    bcrypt.hash(request.body.password, 10)
        .then(hash => {
            //I want to create a new user & store it in the database
            const user = new User({
                email: request.body.email,
                password: hash  
            });
            user.save()
                .then(result => {
                    response.status(201).json({
                        message: "User created",
                        result: result
                    });
                })
                .catch(error => {
                    result.status(500).json({
                        error: error
                    });
                });
        });
});

module.exports = router;