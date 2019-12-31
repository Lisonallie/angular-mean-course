import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}
  //use auth service to get the token we need
  ngOnInit() {
    //set up subscription to the authStatusListener in auth.service.js
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
