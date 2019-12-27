import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []; //declare posts class exportation
  //                                  vv now has a post property which passes an array of Posts
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>(); //passing a list of posts to the subject

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    // two backticks is a template expression
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    //want to return get request from backend (inject angular http client into the service)
    //Expects a path to our server
    //                                              vvv need to listen (subscribe)
    //for observables built in to angular like the http client, the unsubscribe is handled automatically by angular
    //get method here already handles the json format input and outputs javascript
    this.http
    .get<{id: string, message: string, posts: any, maxPosts: number}>(
      'http://localhost:3000/api/posts' + queryParams
      )
      //postData is declared here & given a value
      .pipe(map((postData) => {
        //convert any post with map
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
      //when we get a response gives access to this response
      //setting the posts to the posts coming from the server
      this.posts = transformedPostData.posts;
      //inform the other parts of our app about this update
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
    //remember subscribe has 3 arguments
    //return [...this.posts]; //copy(take all elements from other array, pull them out and add them to this new array) array here with spread operator
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); //returns an object from which we can listen, but can't emit
  }

  getPost(id: string) {
    //pull out all the properties of an object & add them to a new object
    //                        vv executed on every post in the array, check if the post we're looking at has the same id as our id: string we're passing as an argument
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
    // old code --> return {...this.posts.find(post => post.id === id)};
  }

  addPost(title: string, content: string, image: File) {
    //instead of sending json back, will send form data
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    //              pass image string, image object, and 3rd identify filename by image title which has been passed in the backend
    postData.append("image", image, title);

    // Old code:   const post: Post = { id: null, title: title, content: content};

    //Store it on the server (optimistic updating) updating local data before we have serverside communication that it's succeeded
    //                                                                         vvv need to subscribe to the response or it does nothing
    this.http.post<{ message: string; post: Post }>("http://localhost:3000/api/posts", postData).subscribe((responseData) => {
      console.log(responseData.message);
      const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      //after done subscribing, reach out to router & navigater
      this.router.navigate(["/"]);
    });


    //removing these from afterwards and into the subscribe function causes the data not to update until it has receivedthe server response. before it was doing it regardless.
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]); //emits a new value(copy of array)
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    // old code     const post: Post = { id: id, title: title, content: content, imagePath: null };
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title),
      postData.append("content", content),
      postData.append("image", image, title)
    } else {
      postData = { id: id, title: title, content: content, imagePath: image}
    }
    this.http.patch("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        //locally update the posts once you have the successful response
        //clone post array and store it in this constant
        const updatedPosts = [...this.posts];
        //vvthis doesn't work because we never visit the post list array so there is nothing to updatevv
        //Search for old post version by its' id
        //                                  vv returns true if we found the post we're looking for
        const oldPostIndex = updatedPosts.findIndex(posts => posts.id === id);
        //found index of post I want to replace
        //later: create post for here 
        const post: Post = { id: id, title: title, content: content, imagePath: ""};
        updatedPosts[oldPostIndex] = post;
        //immutable way of updating the old post
        this.posts = updatedPosts;
        //send copy of updatedPosts with it
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    const confirmation = window.confirm("Are you sure you want to delete this post?");
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        if (confirmation === true) {
          console.log("deleted");
          const updatedPosts = this.posts.filter(post => post.id !== postId);
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
        } else {
          return;
        }
      });
  }
}
