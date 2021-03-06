import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

//interceptor is official feature provided by the angular http client 
//functions that will run on any outgoing http request, can then manipulate these requests, ex: attaching our token

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    //intercept method is required, angular calls it for requests leaving my app
    //interceptor works a lot like middleware just for outgoing requests instead of incoming

    constructor(private dialog: MatDialog) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
            //allows us to handle errors emitted in this stream of requests
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "An unknown error occurred"
                if(error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                    //need to return an observable here
                return throwError(error);
                
            })
        );
    };
}