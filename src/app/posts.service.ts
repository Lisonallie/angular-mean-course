import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []; //declare posts class exportation
  private postsUpdated = new Subject<Post[]>(); //passing a list of posts to the subject

  constructor(private http: HttpClient) { }

  getPosts() {
    //want to return get request from backend (inject angular http client into the service)
    //Expects a path to our server
    //                                              vvv need to listen (subscribe)
    //for observables built in to angular like the http client, the unsubscribe is handled automatically by angular
    //get method here already handles the json format input and outputs javascript
    this.http
    .get<{id: string, message: string, posts: any}>(
      'http://localhost:3000/api/posts'
      )
      //postData is declared here & given a value
      .pipe(map((postData) => {
        //convert any post with map
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
      //when we get a response gives access to this response
      //setting the posts to the posts coming from the server
      this.posts = transformedPosts;
      //inform the other parts of our app about this update
      this.postsUpdated.next([...this.posts]);
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
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
    // old code --> return {...this.posts.find(post => post.id === id)};
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content};
    //Store it on the server (optimistic updating) updating local data before we have serverside communication that it's succeeded
    //                                                                         vvv need to subscribe to the response or it does nothing
    this.http.post<{message: string}>("http://localhost:3000/api/posts", post).subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });


    //removing these from afterwards and into the subscribe function causes the data not to update until it has receivedthe server response. before it was doing it regardless.
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]); //emits a new value(copy of array)
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.patch("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => {
        //locally update the posts once you have the successful response
        //clone post array and store it in this constant
        const updatedPosts = [...this.posts];
        //vvthis doesn't work because we never visit the post list array so there is nothing to updatevv
        //Search for old post version by its' id
        //                                  vv returns true if we found the post we're looking for
        const oldPostIndex = updatedPosts.findIndex(posts => posts.id === post.id);
        //found index of post I want to replace
        updatedPosts[oldPostIndex] = post;
        //immutable way of updating the old post
        this.posts = updatedPosts;
        //send copy of updatedPosts with it
        this.postsUpdated.next([...this.posts]);
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
