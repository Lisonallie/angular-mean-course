import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService} from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = []; //@Input()    with Input, can bind to this element from the direct parent(app)
                //add type post here to specify it's a post.
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;

  constructor(public postsService: PostsService) { //public keyword automatically creates a new property in this component & stores the incoming value in that property
    
  }

  ngOnInit() { //lifecycle hook
    this.isLoading = true;
    this.postsService.getPosts(); //fetching
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts; //updates whenever receives a new value
      //now want to make sure that for the subscription we set up when it is not part of the DOM that it is not living anymore. otherwise there is a MEMORY LEAK
    });
    //subscribe subscribes you to the post update, takes 3 possible arguments:
    //1: function which gets executed whenever new data is emitted next()
    //2: will be called whenever an error is emitted error()
    //3: function called whenever the observable is completed/ there are no more values to be expected complete()
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
