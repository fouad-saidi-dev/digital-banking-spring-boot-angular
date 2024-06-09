import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync, Router,
  RouterStateSnapshot
} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthorizationGuard {
  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.roles.includes("ADMIN")) {
      console.log("Auth")
      return true;
    } else {
      this.router.navigateByUrl('/admin/notAuthorized')
      console.log("notAuth")
      return false;
    }
  }

}
