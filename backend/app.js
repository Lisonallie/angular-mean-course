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
app.use((request, response, next) => {
    response.send('hello friend');
});