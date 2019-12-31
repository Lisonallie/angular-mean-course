import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService} from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../auth.service';
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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) { //public keyword automatically creates a new property in this component & stores the incoming value in that property
    
  }

  ngOnInit() { //lifecycle hook
    this.isLoading = true;
    //                                            vv current page
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //fetching
    //                                                                  vv since we updated our subject (in posts services), we're getting back a JS object instead
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts; //updates whenever receives a new value
      //now want to make sure that for the subscription we set up when it is not part of the DOM that it is not living anymore. otherwise there is a MEMORY LEAK
    });
    //subscribe subscribes you to the post update, takes 3 possible arguments:
    //1: function which gets executed whenever new data is emitted next()
    //2: will be called whenever an error is emitted error()
    //3: function called whenever the observable is completed/ there are no more values to be expected complete()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  

  onDelete(postId: string) {
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.isLoading = true;
        //                vvv re-fetch posts upon delete
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
