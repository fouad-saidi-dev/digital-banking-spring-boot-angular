import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {map, Observable} from "rxjs";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{
  public customersCount$!:Observable<number>;


  constructor(private customerService:CustomerService) {
  }
  ngOnInit(): void {
    this.customersCount$ = this.customerService.getCustomers().pipe(
      map(customers => customers.length)
    )
    this.customersCount$.subscribe(count=>console.log(count))
  }

}
