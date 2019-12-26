const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    //pass a javascript object, define the fields & types of data the fields should store
    //in nodejs to declare type it's with a capital
    //title: String
    //add more information:
    title: { type: String, required: true }, //find more specifications in mongoose docs
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

//mongoose needs a model to work with it
//             vv name of model, should be capital
                    //vv schema to use
module.exports = mongoose.model('Post', postSchema);
//^^ w/ use of this the model can be used outside of this file
