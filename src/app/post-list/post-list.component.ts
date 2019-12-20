import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() posts = []; //with Input, can bind to this element from the direct parent(app)

  constructor() { }

  ngOnInit() {
  }

}
