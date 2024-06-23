import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";
import {User} from "../models/user.module";
import {Role} from "../models/role.model";

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

  public addRoleToUser(username: string, role: string): Observable<any> {
    let data = {username, role}
    return this.http.post<any>(`${environment.backendHost}/auth/addRole?username=${username}&role=${data.role}`, data)
  }

  public removeRoleFromUser(username: string, role: string): Observable<any> {
    return this.http.delete<any>(`${environment.backendHost}/auth/deleteRole?username=${username}&role=${role}`)
  }

  public getRolesUser(username: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(`${environment.backendHost}/auth/roles/${username}`);
  }
  public saveRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${environment.backendHost}/auth/newRole`, role);
  }
  public getRoles(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(`${environment.backendHost}/auth/roles`);
  }
  public deleteRole(role: Role): Observable<Role> {
    return this.http.delete<Role>(`${environment.backendHost}/auth/deleteRole/${role.role}`);
  }
}
