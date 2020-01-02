import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  //want to be able to push that token info to the component that needs it 
  private authStatusListener = new Subject<boolean>();

  //I want to send an http request so I need to inject the http client
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
      //send request, should go to our local domain /api/user/signup
      // for this request need to create a new model
      this.http.post("http://localhost:3000/api/user/signup", authData)
        .subscribe(response => {
          console.log(response);
        });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        // here subscribes to the backend basically. when we add the token here, it accesses it through the response
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
            //                    vv add this because it's in seconds
          }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          //informing everyone who's interested about our header being authenticated
          this.authStatusListener.next(true);
          // creates a date object for the current moment, need it to be able to pass as argument to saveauthdata
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData('token', expirationDate);          
          //redirect to homepage
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    //try to automatically authenticate the user if we already have the information required for a user

  }

  logout() {
    //clear token
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    this.clearAuthData();
    //clears timer upon logout
    clearTimeout(this.tokenTimer);
  }

  //store data in the local storage once authenticated
  private saveAuthData(token: string, expirationDate: Date) {
    //localstorage API I can access
    //key & value pairs
    localStorage.setItem('token', token);
    //                                                vvv serialized & standardized version of the string
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    //remove the auth data
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    //need to make so can use autoauthuser
  }
}
