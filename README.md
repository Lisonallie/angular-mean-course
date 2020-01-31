## This project is deployed [here](http://angular-mean-node-post-app.s3-website-us-east-1.amazonaws.com/auth/login).

### What it is
This was a project to learn the MEAN stack by creating a posting app. The MEAN stack is mongoDB, Express framework, angular, nodejs.

### How it works
The routes are as follows:

**""**: The main page which displays the post-list component, a list of the posts in the database. A post includes a title, content, and a locally uploaded image. The post-model.ts also includes an id and a creator.

**"create"**: The page used to create a post, including a title, content, and an image.

**"edit/postId"**: Upon click of a post's EDIT button, they are sent to this route displaying the post and the postId is appended to the URL so the user sees just the 1 post from the database, and can edit it. Upon submit of the edited post, the new values of the post are updated in the database with a PATCH method.

**"auth"**: auth is the precursor to the login and signup components and not an actual route itself. The login & signup are actually "auth/login" & "auth/signup", respectively. "auth" is used to import the route precursor into the regular routing module/ connect them to make the code more organized.

**"login"**: This page redirects to the login component, which displays a login screen where an existing user can login. The username cannot be the same as another user's, and the password must match to login. Once the user logs in, they have access to all posts but are only permitted to edit or delete posts they have created themselves with the account they are logged in with.

**"signup"**: The signup page is where a new account can be registered with the fields 'E-mail' & 'Password'.

### How it looks
