import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  @Output() postCreated = new EventEmitter<Post>(); // this says it's going to output an event (postCreated)
                                        //Adding Post here tells what type of data it's going to emit.(will be a Post)

  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const post: Post = {title: this.enteredTitle, content: this.enteredContent}; //FOr Post here you don't need to specify that it's an array.
    this.postCreated.emit(post); //important to bind post as argument to it so it will output the title and content.
  }

}
