//check whether authenticated or not
// if (a) you do have a token attached to your request but that doesn't mean the token is valid
// so we validate this token

const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
//function that gets executed on the request
    //attach authorization info to a request, stored in headers
    //                                          vv "Bearer" is commonality string used, use split to get the 1st instance of it
    //                                                     vv part after the white space, aka our Token
    //                                                        vv token(comment)
    //                              vv looks like "Bearer sdlfkqjldsjfqmsqdlf"
    const token = request.headers.authorization.split(" ")[1];
};