import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.sass']
})
export class PostCreateComponent implements OnInit {
  newPost = '';


  constructor() { }

  ngOnInit() {
  }

  onAddPost() {
    this.newPost = "The user's post";
  }

}
