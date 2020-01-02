import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }

  // storedPosts: Post[] = []; //Post is typescript syntax for saying we have an array of posts in there from the imported interface.

  // onPostAdded(post) { //was missing post as an argument!! Angular couldn't connect the dots.
  //   this.storedPosts.push(post); //add this post to the empty array above to show posts.
  // } //                    ^^^with the :Post[] type above, if you put anything in here except Post you will get an error saying it's not of the type Post.
}
