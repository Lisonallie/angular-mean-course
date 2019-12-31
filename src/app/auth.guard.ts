import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

//guarding routes, angular can have the router check the info in here before loading a route to see if it should proceed or not
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService) {}

    // click on error then lightbulb and click add interface
    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        // if you return true the router will say ok this route is accessible and give access
        // if you return false the router will deny access to the route
        // don't want to hard code true or false, but want to get the info from the auth service
        return true;
    }

}