//check whether authenticated or not
// if (a) you do have a token attached to your request but that doesn't mean the token is valid
// so we validate this token

const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
    //will try to execute this but it can fail
  try {
    //function that gets executed on the request
    //attach authorization info to a request, stored in headers
    //                                          vv "Bearer" is commonality string used, use split to get the 1st instance of it
    //                                                     vv part after the white space, aka our Token
    //                                                        vv token(comment)
    //                              vv looks like "Bearer sdlfkqjldsjfqmsqdlf"
    const token = request.headers.authorization.split(" ")[1];
    //yes it works yay, able to extract token
    //verify token
    //      vv also throws an error if it doesn't verify
    //                  vv same secret string as defined in user.js
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    //                                  vvv these parameters are created in the user route
    request.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {  //if it fails
    //don't have a token, not authenticated
    response.status(401).json({
        message: "Invalid token. You are not authenticated"
    })
  }
  
};
