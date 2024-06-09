import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = "http://localhost:8084"
  isAuthenticated: boolean = false;
  username: any;
  accessToken: any;
  roles: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  public login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
    }
    let params = new HttpParams()
      .set("username", username).set("password", password)
    return this.http.post(`${environment.backendHost}/auth/login`, params, options)
  }

  public loadProfile(data: any) {
    this.isAuthenticated = true
    this.accessToken = data['access_token']
    let jwtDecoder: any = jwtDecode(this.accessToken)
    this.username = jwtDecoder.sub;
    this.roles = jwtDecoder.scope;
    window.localStorage.setItem('jwt-token', this.accessToken)
  }

  logout() {
    this.isAuthenticated = false
    this.accessToken = undefined
    this.username = undefined
    this.roles = undefined
    window.localStorage.removeItem("access_token")
    this.router.navigateByUrl("/login")
  }

  loadJwtTokenFromLocaleStorage() {
    let token = window.localStorage.getItem('jwt-token')
    if (token) {
      this.loadProfile({'access_token': token})
      this.router.navigateByUrl("/admin/customers")
    }
  }
}
