import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []; //declare posts class exportation

  constructor() { }

  getPosts() {
    return [...this.posts]; //copy(take all elements from other array, pull them out and add them to this new array) array here with spread operator
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
  }
}
