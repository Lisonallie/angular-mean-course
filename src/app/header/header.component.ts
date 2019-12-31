import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}
  //use auth service to get the token we need
  ngOnInit() {
    //set up subscription to the authStatusListener in auth.service.js
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      //push the information to the component and use it in the component
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    //should clear the token & inform all chained bits of the changed authentication status--for this need to edit the auth service.js
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
