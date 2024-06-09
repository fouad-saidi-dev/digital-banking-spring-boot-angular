import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (!request.url.includes("/auth/login")) {
      let req = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.authService.accessToken)
      })
      return next.handle(req).pipe(
        catchError(err => {
          if (err.status==401)
          this.authService.logout()
          return throwError(err.message)
        })
      );
    } else return next.handle(request)
  }

}
