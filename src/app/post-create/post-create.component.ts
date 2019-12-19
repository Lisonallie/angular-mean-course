import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredValue = "";
  newPost = 'NO CONTENT';


  constructor() { }

  ngOnInit() {
  }

  onAddPost(postInput: HTMLTextAreaElement) {
    this.newPost = this.enteredValue;
  }

}
