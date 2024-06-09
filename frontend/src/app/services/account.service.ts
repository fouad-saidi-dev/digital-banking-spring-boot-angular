import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AccountDetails} from "../models/account.model";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "http://localhost:8084"

  constructor(private http: HttpClient) {
  }

  public getAccount(accountId:string,page:number,size:number):Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${environment.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`)
  }
  public debit(accountId:string,amount:number,description:string){
    let data={
      accountId:accountId,
      amount:amount,
      description:description
    }
    return this.http.post(`${environment.backendHost}/accounts/debit`,data)
  }
  public credit(accountId:string,amount:number,description:string){
    let data={
      accountId:accountId,
      amount:amount,
      description:description
    }
    return this.http.post(`${environment.backendHost}/accounts/debit`,data)
  }
  public transfer(accountIdSource:string,accountIdDestination:string,amount:number,description:string){
    let data={
      accountIdSource:accountIdSource,
      accountIdDestination:accountIdDestination,
      amount:amount,
      description:description
    }
    return this.http.post(`${environment.backendHost}/accounts/debit`,data)
  }
}
