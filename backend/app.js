const express = require('express');
//chain of middlewares (funnel send express & have different parts & each part does something different w/ the request)
const app = express();
//uses a new middleware on our app & on our request
//next() skips to next part of funnel^
app.use((request, response, next) => {
    console.log('first middleware');
    next();
});

//does something with the response from 1st next function
//also ends response writing stream & returns this response
app.use((request, response, next) => {
    response.send('hello friend');
});

//export this app
//exports the const & all the new middlewares we added to it
module.exports = app;