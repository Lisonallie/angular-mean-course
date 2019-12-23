//import in nodejs     vvvdefault nodejs pacakge (http)
const http = require('http');

//with this imported we can use the http package to create a new server
//takes a function as an argument and the function has 2 arguments request & response
http.createServer((request, response) => {
    response.end('This is my first response');
});