import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []; //declare posts class exportation
  private postsUpdated = new Subject<Post[]>(); //passing a list of posts to the subject

  constructor() { }

  getPosts() {
    return [...this.posts]; //copy(take all elements from other array, pull them out and add them to this new array) array here with spread operator
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable(); //returns an object from which we can listen, but can't emit
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]); //emits a new value(copy of array)
  }
}
