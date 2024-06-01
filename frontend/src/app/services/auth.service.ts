import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = "http://localhost:8084"
  isAuthenticated: boolean = false;
  username!: string;
  accessToken!: string;
  roles: any;

  constructor(private http: HttpClient) {
  }

  public login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
    }
    let params = new HttpParams()
      .set("username", username).set("password", password)
    return this.http.post(`${this.baseUrl}/auth/login`, params, options)
  }

  public loadProfile(data: any) {
    this.isAuthenticated = true
    this.accessToken = data['access-token']
    let jwtDecoder: any = jwtDecode(this.accessToken)
    this.username = jwtDecoder.sub;
    this.roles = jwtDecoder.scope;
  }
}
