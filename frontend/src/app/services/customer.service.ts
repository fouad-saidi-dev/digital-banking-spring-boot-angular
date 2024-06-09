import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Customer} from "../models/customer.model";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  baseUrl:string="http://localhost:8084";
  constructor(private http:HttpClient) { }

  public getCustomers():Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>(`${environment.backendHost}/customers`);
  }
  public searchCustomers(keyword:string):Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>(`${environment.backendHost}/customers/search?keyword=${keyword}`);
  }
  public saveCustomer(customer:Customer):Observable<Customer>{
    return this.http.post<Customer>(`${environment.backendHost}/customers`,customer)
  }
  public editCustomer(customer:Customer):Observable<Customer>{
    return this.http.put<Customer>(`${environment.backendHost}/customers/${customer.id}`,customer)
  }
  public deleteCustomer(customer:Customer):Observable<Customer>{
    return this.http.delete<Customer>(`${environment.backendHost}/customers/${customer.id}`)
  }

  getCustomerById(id:number):Observable<Customer> {
    return this.http.get<Customer>(`${environment.backendHost}/customers/${id}`)
  }
}
