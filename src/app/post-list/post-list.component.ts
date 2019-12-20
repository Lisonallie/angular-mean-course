import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService} from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() posts: Post[] = []; //with Input, can bind to this element from the direct parent(app)
                //add type post here to specify it's a post.

  constructor(public postsService: PostsService) { //public keyword automatically creates a new property in this component & stores the incoming value in that property
    
  }

  ngOnInit() { //lifecycle hook
    this.posts = this.postsService.getPosts();
  }

}
