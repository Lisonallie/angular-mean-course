import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //I want to send an http request so I need to inject the http client
  constructor(private http: HttpClient) { }

  createUser(email: String, password: String) {
      //send request, should go to our local domain /api/user/signup
      this.http.post("http://localhost:3000/api/user/signup");
  }
}
