import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';

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
    this.http.get<{id: string, message: string, posts: Post[]}>('http://localhost:3000/api/posts').subscribe((postData) => {
      //when we get a response gives access to this response
      //setting the posts to the posts coming from the server
      this.posts = postData.posts;
      //inform the other parts of our app about this update
      this.postsUpdated.next([...this.posts]);
    });
    //remember subscribe has 3 arguments
    //return [...this.posts]; //copy(take all elements from other array, pull them out and add them to this new array) array here with spread operator
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); //returns an object from which we can listen, but can't emit
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]); //emits a new value(copy of array)
  }
}
