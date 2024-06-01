import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Customer} from "../models/customer.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  baseUrl:string="http://localhost:8084";
  constructor(private http:HttpClient) { }

  public getCustomers():Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>(`${this.baseUrl}/customers`);
  }
  public searchCustomers(keyword:string):Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>(`${this.baseUrl}/customers/search?keyword=${keyword}`);
  }
  public saveCustomer(customer:Customer):Observable<Customer>{
    return this.http.post<Customer>(`${this.baseUrl}/customers`,customer)
  }
  public editCustomer(customer:Customer):Observable<Customer>{
    return this.http.put<Customer>(`${this.baseUrl}/customers/${customer.id}`,customer)
  }
  public deleteCustomer(customer:Customer):Observable<Customer>{
    return this.http.delete<Customer>(`${this.baseUrl}/customers/${customer.id}`)
  }
}
