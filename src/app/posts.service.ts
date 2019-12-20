import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []; //declare posts class exportation

  constructor() { }

  getPosts() {
    return [...this.posts]; //copy array here
  }
}
