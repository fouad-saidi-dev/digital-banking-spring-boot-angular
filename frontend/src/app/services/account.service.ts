import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Account, AccountDetails, AccountPagination} from "../models/account.model";
import {environment} from "../../environments/environment.development";
import {Customer} from "../models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "http://localhost:8084"

  constructor(private http: HttpClient) {
  }

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${environment.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`)
  }

  public debit(accountId: string, amount: number, description: string) {
    let data = {
      accountId: accountId,
      amount: amount,
      description: description
    }
    return this.http.post(`${environment.backendHost}/accounts/debit`, data)
  }

  public credit(accountId: string, amount: number, description: string) {
    let data = {
      accountId: accountId,
      amount: amount,
      description: description
    }
    return this.http.post(`${environment.backendHost}/accounts/credit`, data)
  }

  public transfer(accountIdSource: string, accountIdDestination: string, amount: number, description: string) {
    let data = {
      accountIdSource: accountIdSource,
      accountIdDestination: accountIdDestination,
      amount: amount,
      description: description
    }
    return this.http.post(`${environment.backendHost}/accounts/transfer`, data)
  }

  public getAccountsCustomer(id: number): Observable<Array<Account>> {
    return this.http.get<Array<Account>>(`${environment.backendHost}/accounts/customer/${id}`);
  }

  public countOperationsCredit() {
    return this.http.get<any>(`${environment.backendHost}/accounts/countOperationsCredit`)
  }

  public countOperationsDebit() {
    return this.http.get<any>(`${environment.backendHost}/accounts/countOperationsDebit`)
  }

  public getAccounts(): Observable<Array<Account>> {
    return this.http.get<Array<Account>>(`${environment.backendHost}/accounts`)
  }

  public savingAccount(account: Account): Observable<Account> {
    const accountDTO = {
      ...account,
      customerDTO: {id: account.customerDTO.id}
    };
    return this.http.post<Account>(`${environment.backendHost}/accounts/addSavingAccount`, accountDTO);
  }

  public currentAccount(account: Account): Observable<Account> {
    const accountDTO = {
      ...account,
      customerDTO: {id: account.customerDTO.id}
    };
    return this.http.post<Account>(`${environment.backendHost}/accounts/addCurrentAccount`, accountDTO);
  }

  public searchAccounts(keyword: string,page:number,size:number): Observable<AccountPagination> {
    return this.http.get<AccountPagination>(`${environment.backendHost}/accounts/pagination?keyword=${keyword}&page=${page}&size=${size}`)
  }

}
