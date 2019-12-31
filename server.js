//starting a server with error handling
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

//makes sure that when we try to set up a port and especially when we receive it from an environment variable, we make sure it's a valid number
const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };

//checks which type of error occured & logs that error
const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

//log that we are listening to incoming requests 
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
  };

//Setting port utilizing normalizePort() from above
const port = normalizePort(process.env.PORT || "3000");
//setting this on our express app
app.set("port", port);


//Set up node server
const server = http.createServer(app);
//register 2 listeners, 1 for errors that might occur, & one for whenever we start listening
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);


//import in nodejs     vvvdefault nodejs pacakge (http)
// const http = require('http');

// //imports our express app
// const app = require('./backend/app');

// //const for server port info
// const port = process.env.PORT || 3000;

// //set configuration for express environment
// app.set('port', port);
// const server = http.createServer(app);

// //start the server
// server.listen(port);

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