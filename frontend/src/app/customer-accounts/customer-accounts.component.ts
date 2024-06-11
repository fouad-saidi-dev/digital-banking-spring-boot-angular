import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../models/customer.model";
import {AccountService} from "../services/account.service";
import {catchError, Observable, throwError} from "rxjs";
import {Account} from "../models/account.model";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrl: './customer-accounts.component.css'
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: number;
  customer!: Customer;
  accounts!: Observable<Array<Account>>;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
              , private accountService: AccountService) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.params['id']
    //console.log(this.customer)
    this.accounts = this.accountService.getAccountsCustomer(this.customerId).pipe(
      catchError(err => {
        //this.errorMessage = err.message;
        return throwError(err);
      })
    )
    this.accounts.subscribe(accounts=>console.log(accounts) )
  }


}
