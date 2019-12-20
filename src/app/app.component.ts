import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts = [];

  onPostAdded() {
    this.posts.push(post); //add this post to the empty array above to show posts.
  }
}
