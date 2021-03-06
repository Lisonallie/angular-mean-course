import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

const BACKEND_URL_SIGNUP = environment.apiUrl + "/user/signup/";
const BACKEND_URL_LOGIN = environment.apiUrl + "/user/login/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
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

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
      //send request, should go to our local domain /api/user/signup
      // for this request need to create a new model
      return this.http.post(BACKEND_URL_SIGNUP, authData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      }, error => {
        //tell app we're not authenticated
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL_LOGIN, authData)
      .subscribe(response => {
        // here subscribes to the backend basically. when we add the token here, it accesses it through the response
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          //when we get back the response and know that we have a token
          this.userId = response.userId;
          //informing everyone who's interested about our header being authenticated
          this.authStatusListener.next(true);
          // creates a date object for the current moment, need it to be able to pass as argument to saveauthdata
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData('token', expirationDate, this.userId);          
          //redirect to homepage
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    //try to automatically authenticate the user if we already have the information required for a user
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    //check if token is still valid (not expired)
    const now = new Date();
    //                 vv getting difference between expiration date & current date
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();    
    if (expiresIn > 0) {
      //if yes then user should be authenticated
      this.token = authInformation.token;
      this.isAuthenticated = true;
      //              vvv the userId fetched from the localstorage
      this.userId = authInformation.userId;
      //Set timer, authtimer works in seconds so have to get back to milliseconds
      this.setAuthTimer(expiresIn / 1000);
      //                            vvv the user is authenticated
      this.authStatusListener.next(true);

    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    
    this.tokenTimer = setTimeout(() => {
      this.logout();
      //                    vv add this because it's in seconds
    }, duration * 1000);
  }

  logout() {
    //clear token
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
    this.clearAuthData();
    this.userId = null;
    //clears timer upon logout
    clearTimeout(this.tokenTimer);
  }

  //store data in the local storage once authenticated
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    //localstorage API I can access
    //key & value pairs
    localStorage.setItem('token', token);
    //                                                vvv serialized & standardized version of the string
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    //remove the auth data
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    //need to make so can use autoauthuser
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
