const express = require('express');
//chain of middlewares (funnel send express & have different parts & each part does something different w/ the request)
const app = express();
//uses a new middleware on our app & on our request
//next() skips to next part of funnel^
// app.use((request, response, next) => {
//     console.log('first middleware');
//     //without the next() creates a time-out because it doesn't get a response
//     next();
// });

//does something with the response from 1st next function
//also ends response writing stream & returns this response
app.use('/api/posts',(request, response, next) => {
    const posts = [
        { id: 'fad12421l', 
        title: 'first server-side post', 
        content: 'this is coming from the server'},

        { id: 'ksajflaj132', 
        title: 'second server-side post', 
        content: 'this is coming from the server!'}
    ];
    //can send posts or a more complicated method::
    response.status(200).json({
        message: "posts fetched successfully!",
        posts: posts
    });
    //response.send('hello friend');
});

//export this app
//exports the const & all the new middlewares we added to it
module.exports = app;