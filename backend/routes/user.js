//implement login and signup routes
const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/users");

const router = express.Router();

router.post("/signup", (request, response, next) => {
    //encrypt password (hash)
    //          v what to hash,       v salting round, higher number, longer it'll take but safer it'll be
    bcrypt.hash(request.body.password, 10)
    //.then is a promise, yields us the hash once it's done
        .then(hash => {
            //I want to create a new user & store it in the database
            const user = new User({
                email: request.body.email,
                password: hash  
            });
            //     vv save the user to the database
            user.save()
                .then(result => {
                    response.status(201).json({
                        message: "User created",
                        result: result
                    });
                })
                //to show what happens when we try to add a user whose email is already stored in the database
                .catch(error => {
                    result.status(500).json({
                        //      vv holds the error I'm getting
                        error: error
                    });
                });
        });
});

module.exports = router;