import {Component, OnInit} from '@angular/core';
import {AccountService} from "../services/account.service";
import {catchError, Observable, throwError} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountDetails} from "../models/account.model";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable !: Observable<AccountDetails>
  operationFormGroup!: FormGroup
  errorMessage!: string;

  constructor(private accountService: AccountService,
              private formBuilder: FormBuilder,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.accountFormGroup = this.formBuilder.group({
      accountId: this.formBuilder.control('')
    })
    this.operationFormGroup = this.formBuilder.group({
      type: this.formBuilder.control(null),
      amount: this.formBuilder.control(0),
      description: this.formBuilder.control(''),
      accountDestination: this.formBuilder.control('')
    })
  }

  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize)
      .pipe(
        catchError(err => {
          this.errorMessage = err.message
          return throwError(err)
        })
      )
  }

  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFormGroup.value.type;
    let amount: number = this.operationFormGroup.value.amount;
    let description: string = this.operationFormGroup.value.description;
    let accountDestination: string = this.operationFormGroup.value.accountDestination;

    if (operationType == 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success Debit");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType == 'CREDIT') {
      console.log("OperationType :", operationType)
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success Credit");
          console.log("OperationType :", operationType)
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType == 'TRANSFER') {
      console.log("OperationType :", operationType)
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: (data) => {
          alert("Success Transfer");
          console.log("OperationType :", operationType)
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  gotoPage(page: number) {
    this.currentPage = page
    this.handleSearchAccount()
  }
}
