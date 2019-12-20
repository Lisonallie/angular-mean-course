import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  @Output() postCreated = new EventEmitter(); // this says it's going to output an event (postCreated)


  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    const post = {title: this.enteredTitle, content: this.enteredContent};
    this.postCreated.emit(post); //important to bind post as argument to it so it will output the title and content.
  }

}
