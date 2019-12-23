//import in nodejs     vvvdefault nodejs pacakge (http)
const http = require('http');

//imports our express app
const app = require('./backend/app');

//const for server port info
const port = process.env.PORT || 3000;

//set configuration for express environment
app.set('port', port);
const server = http.createServer(app);

//start the server
server.listen(port);

//with this imported we can use the http package to create a new server
//takes a function as an argument and the function has 2 arguments request & response


//old code vvv
// const server = http.createServer((request, response) => {
//     response.end('This is my first response');
// });
//pass server a port to listen to
//            vv access environment variable with pre-determined port OR go to port 3000


//old code vvv
//server.listen(process.env.PORT || 3000);

//if you change something in the server-side code in this file, need to quit & restart server to see changes.

//Going to use expressjs to avoid writing directly in nodejs for the backend.