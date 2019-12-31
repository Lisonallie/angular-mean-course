import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //I want to send an http request so I need to inject the http client
  constructor(private http: HttpClient) { }

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
    this.http.post("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        // here subscribes to the backend basically. when we add the token here, it accesses it through the response
        console.log(response);
      });
  }
}
