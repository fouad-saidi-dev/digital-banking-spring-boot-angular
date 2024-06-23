import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {catchError, Observable, throwError} from "rxjs";
import {Customer} from "../models/customer.model";
import {AccountService} from "../services/account.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-bank-account',
  templateUrl: './new-bank-account.component.html',
  styleUrl: './new-bank-account.component.css'
})
export class NewBankAccountComponent implements OnInit {
  showForm: string = "";
  customers!: Observable<Array<Customer>>;
  formSaving!: FormGroup;
  formCurrent!: FormGroup;

  constructor(private customerService: CustomerService,
              private accountService: AccountService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getCustomers()
    this.formSaving = this.formBuilder.group({
      balance: this.formBuilder.control('', Validators.required),
      interestRate: this.formBuilder.control('', Validators.required),
      customerDTO: this.formBuilder.control('', Validators.required)
    })
    this.formCurrent = this.formBuilder.group({
      balance: this.formBuilder.control('', Validators.required),
      overDraft: this.formBuilder.control('', Validators.required),
      customerDTO: this.formBuilder.control('', Validators.required)
    })
  }

  getCustomers() {
    this.customers = this.customerService.getCustomers().pipe(
      catchError(err => {
        console.log(err)
        return throwError(err);
      })
    )

  }

  showFormAccount(type: string) {
    this.showForm = type;
    console.log(this.showForm);
  }

  handleSaveAccount() {
    if (this.showForm == 'saving') {
      let account = this.formSaving.value
      this.accountService.savingAccount({...account,customerDTO: { id: account.customerDTO }}).subscribe({
        next: account => {
          alert("Account was created success!")
          console.log(account)
        },
        error: err => {
          console.log(err)
        }
      })
    } else {
      let account = this.formCurrent.value
      this.accountService.currentAccount({...account,customerDTO: { id: account.customerDTO }}).subscribe({
        next: account => {
          alert("Account was created success!")
          console.log(account)
        },
        error: err => {
          console.log(err)
        }
      })
    }
  }
}
