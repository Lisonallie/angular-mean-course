import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

//interceptor is official feature provided by the angular http client 
//functions that will run on any outgoing http request, can then manipulate these requests, ex: attaching our token

export class ErrorInceptor implements HttpInterceptor {
    //intercept method is required, angular calls it for requests leaving my app
    //interceptor works a lot like middleware just for outgoing requests instead of incoming
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
            //allows us to handle errors emitted in this stream of requests
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                alert(error.error.message);
                //need to return an observable here
                return throwError(error);
                
            })
        );
    };
}