import {Component, OnInit} from '@angular/core';
import {Customer} from "../models/customer.model";
import {CustomerService} from "../services/customer.service";
import {catchError, Observable, throwError} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  public customers !: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup!: FormGroup;

  constructor(private customerService: CustomerService,
              private formBuilder: FormBuilder,
              private router: Router,
              public authService:AuthService) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      keyword: this.formBuilder.control('')
    })
    this.handleSearchCustomers()
  }


  handleSearchCustomers() {
    let keyword = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(keyword)
      .pipe(
        catchError(err => {
          this.errorMessage = err.message;
          return throwError(err);
        })
      )
  }

  handleDeleteCustomer(customer: Customer) {
    this.customerService.deleteCustomer(customer).subscribe({
      next: (res) => {

        this.handleSearchCustomers()
      },
      error: err => {
        console.log(err)
      }
    })
  }

  handleEditCustomer(customer: Customer) {
    this.router.navigateByUrl(`/admin/edit-customer/${customer.id}`)
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl(`/admin/customer-accounts/${customer.id}`)
  }
}
