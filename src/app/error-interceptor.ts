import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

//interceptor is official feature provided by the angular http client 
//functions that will run on any outgoing http request, can then manipulate these requests, ex: attaching our token

export class ErrorInceptor implements HttpInterceptor {
    constructor() {}
    //intercept method is required, angular calls it for requests leaving my app
    //interceptor works a lot like middleware just for outgoing requests instead of incoming
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request);
    };
}