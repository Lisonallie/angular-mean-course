import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

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

  onAddPost(form: NgForm) { //NgForm is a new imported type that the behind the scenes angular uses for forms
    const post: Post = {title: form.value.title, content: form.value.content}; //FOr Post here you don't need to specify that it's an array.
                              //These new declarations instead of giving the inputs their own functions, access the form directly through the ngModel names
    this.postCreated.emit(post); //important to bind post as argument to it so it will output the title and content.
  }

}
