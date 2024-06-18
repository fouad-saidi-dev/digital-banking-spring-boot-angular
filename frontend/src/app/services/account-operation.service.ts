import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";
import {AccountOperation} from "../models/account.model";
@Injectable({
  providedIn: 'root'
})
export class AccountOperationService {

  constructor(private http:HttpClient) { }

  public getOperations():Observable<Array<AccountOperation>>{
    return this.http.get<Array<AccountOperation>>(`${environment.backendHost}/accounts/operations`)
  }

}
