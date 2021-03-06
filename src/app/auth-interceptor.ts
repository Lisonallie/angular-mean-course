import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

//interceptor is official feature provided by the angular http client 
//functions that will run on any outgoing http request, can then manipulate these requests, ex: attaching our token

//this @injectable is required so we can actually inject services here
@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    //intercept method is required, angular calls it for requests leaving my app
    //interceptor works a lot like middleware just for outgoing requests instead of incoming
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        // new const that holds my token
        const authToken = this.authService.getToken();
        //manipulate the request to hold this token
        //need to clone the request first
        const authRequest = request.clone({
            //adds a new header to the headers and sets a value for it
            //                                 vv name of header
            //                                                          vv value of header
            //                                             vv construct it the same way as the backend
            headers: request.headers.set("Authorization","Bearer " + authToken)
        });
        //allow the request to continue its journey
        return next.handle(authRequest);
    };
}