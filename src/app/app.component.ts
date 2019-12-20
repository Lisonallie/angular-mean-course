import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts = [];

  onPostAdded(post) { //was missing post as an argument!! Angular couldn't connect the dots.
    this.storedPosts.push(post); //add this post to the empty array above to show posts.
  }
}
