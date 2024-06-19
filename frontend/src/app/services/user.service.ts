import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";
import {User} from "../models/user.module";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.backendHost}/auth/addUser`, user)
  }

  public getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${environment.backendHost}/auth/users`)
  }
  public addRoleToUser(username:string,role:string):Observable<any>{
    let data = {username,role}
    return this.http.post<any>(`${environment.backendHost}/auth/addRole?username=${username}&role=${data.role}`,data)
  }
  public removeRoleFromUser(username:string,role:string):Observable<any>{
    return this.http.delete<any>(`${environment.backendHost}/auth/deleteRole?username=${username}&role=${role}`)
  }
  public getRolesUser(username:string):Observable<Array<any>>{
    return this.http.get<Array<any>>(`${environment.backendHost}/auth/roles/${username}`);
  }

}
