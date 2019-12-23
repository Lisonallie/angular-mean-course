const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    //pass a javascript object, define the fields & types of data the fields should store
    //in nodejs to declare type it's with a capital
    //title: String
    //add more information:
    title: { type: String, required: true }, //find more specifications in mongoose docs
    content: { type: String, required: true }
});

