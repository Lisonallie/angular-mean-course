## This project is deployed [here](http://angular-mean-node-post-app.s3-website-us-east-1.amazonaws.com/).

### What it is
This was a project to learn the MEAN stack by creating a posting app. The MEAN stack is mongoDB, Express framework, angular, nodejs.

### How it works
The routes are as follows:

**""**: 

The main page which displays the post-list component, a list of the posts in the database. A post includes a title, content, and a locally uploaded image. The post-model.ts also includes an id and a creator.

**"create"**: 

The page used to create a post, including a title, content, and an image.

**"edit/postId"**: 

Upon click of a post's EDIT button, they are sent to this route displaying the post and the postId is appended to the URL so the user sees just the 1 post from the database, and can edit it. Upon submit of the edited post, the new values of the post are updated in the database with a PATCH method.

**"auth"**: 

auth is the precursor to the login and signup components and not an actual route itself. The login & signup are actually "auth/login" & "auth/signup", respectively. "auth" is used to import the route precursor into the regular routing module/ connect them to make the code more organized.

**"login"**: 

This page redirects to the login component, which displays a login screen where an existing user can login. The username cannot be the same as another user's, and the password must match to login. Once the user logs in, they have access to all posts but are only permitted to edit or delete posts they have created themselves with the account they are logged in with.

**"signup"**: 

The signup page is where a new account can be registered with the fields 'E-mail' & 'Password'.

### How it looks
The user comes to the app page and in the first instance sees the list of existing posts in the database with the ability to choose how many posts they want to see per page:
![](https://img.techpowerup.org/200131/navbarapppost.png)
![](https://img.techpowerup.org/200131/postapppreview.png)

A user can then choose to sign up, creating a new user:
![](https://img.techpowerup.org/200131/signupapppost.png)

Once the new user is created, they can navigate to the login page by clicking Login in the nav bar:
![](https://img.techpowerup.org/200131/loginapppost.png)

After the user has logged in, they come back to the first page of the app (all posts), except this time they are logged in. A user can then choose to create a post by clicking New Post in the nav bar. The user fills in the fields as requested, and when choosing an image a window pops up that lets the user choose a local image. When the user clicks 'Save Post', the post is saved to the database and becomes a part of the list of visible posts:
![](https://img.techpowerup.org/200131/newpostapppost.png)

If a user has created a post, they will have the option to EDIT or DELETE that same post. A user may not delete or edit posts from other users.
![](https://img.techpowerup.org/200131/editdeleteapppost.png)

If the user edits a post, the updated values will reflect in the changed post. If the user deletes a post, the post will disappear automatically from the view.

### Backend
The api routes are manually programmed and include routes for creating a user and creating/editing/fetching/deleting a post. An authorization token is given and decoded for a login session. There are 2 collections in the database: posts & users.

### Summary
This is just a simple posting app I made in order to learn the basics of the MEAN stack and how to create a RESTful API, connect it to the frontend server, etc.
