//import in nodejs     vvvdefault nodejs pacakge (http)
const http = require('http');

//with this imported we can use the http package to create a new server
//takes a function as an argument and the function has 2 arguments request & response
const server = http.createServer((request, response) => {
    response.end('This is my first response');
});
//pass server a port to listen to
//            vv access environment variable with pre-determined port OR go to port 3000
server.listen(process.env.PORT || 3000);

//if you change something in the server-side code in this file, need to quit & restart server to see changes.

//Going to use expressjs to avoid writing directly in nodejs for the backend.