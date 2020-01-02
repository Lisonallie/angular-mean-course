//implement login and signup routes
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

const router = express.Router();

router.post("/signup", (request, response, next) => {
  //encrypt password (hash)
  //          v what to hash,       v salting round, higher number, longer it'll take but safer it'll be
  bcrypt
    .hash(request.body.password, 10)
    //.then is a promise, yields us the hash once it's done
    .then(hash => {
      //I want to create a new user & store it in the database
      const user = new User({
        email: request.body.email,
        password: hash
      });
      //     vv save the user to the database
      user
        .save()
        .then(result => {
          response.status(201).json({
            message: "User created",
            result: result
          });
        })
        //to show what happens when we try to add a user whose email is already stored in the database
        .catch(error => {
          response.status(500).json({
            //      vv holds the error I'm getting
            error: error
          });
        });
    });
});

//create another route that checks for token

router.post("/login", (request, response, next) => {
  //make user accessible in both then blocks
  let fetchedUser;
  //find out whether the email address exists
  User.findOne({ email: request.body.email })
    .then(user => {
      if (!user) {
        // 401 == authentication is denied
        return response.status(401).json({
          message: "Authorization failed, user does not exist"
        });
      }
      fetchedUser = user;
      // match password in database to password entered by user
      //                                            vvv password stored in the database
      return bcrypt.compare(request.body.password, user.password);
    })
    .then(result => {
      //true if successfully compared
      if (!result) {
        return response.status(401).json({
          message: "Authorization failed, no result was given"
        });
      }
      // here we know we have a valid password sent by the user
      //                vvv creates a new token based on input data of your choice
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, 
      //enter our own secret(password) for creating these tokens that'll be stored on the server and will be used to validate these hashes(why they're uncrackable)
      'secret_this_should_be_longer',
      //configure the token(optional)
      {expiresIn: "1h"}
      );      
      //return the token, no further code so don't need to have "return"
      response.status(200).json({
        token: token,
        expiresIn: 3600, //3600 seconds = 1hr
        userId: fetchedUser._id
      })
    })
    .catch(error => {      
      return response.status(401).json({
        message: "Authorization failed, password does not match"
      })
    });
});

module.exports = router;
