import { CanActivate } from '@angular/router';

//guarding routes, angular can have the router check the info in here before loading a route to see if it should proceed or not
export class AuthGuard implements CanActivate {
    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        throw new Error("Method not implemented.");
    }

}