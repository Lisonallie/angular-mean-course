import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() posts: Post[] = []; //with Input, can bind to this element from the direct parent(app)
                //add type post here to specify it's a post.
  constructor() { }

  ngOnInit() {
  }

}
