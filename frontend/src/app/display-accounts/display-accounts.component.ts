import {Component, OnInit} from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {AccountPagination} from "../models/account.model";
import {AccountService} from "../services/account.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-display-accounts',
  templateUrl: './display-accounts.component.html',
  styleUrl: './display-accounts.component.css'
})
export class DisplayAccountsComponent implements OnInit {
  searchFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountPagination>;
  errorMessage!: string;

  constructor(private accountService: AccountService,
              private formBuilder: FormBuilder,
              public authService:AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      keyword: this.formBuilder.control('')
    })
    this.handleSearchAccount()
  }

  handleSearchAccount() {
    let search = this.searchFormGroup.value.keyword
    this.accountObservable = this.accountService.searchAccounts(search, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        console.log(err);
        this.errorMessage = err.message
        return throwError(err);
      })
    )
  }

  gotoPage(page: number) {
    this.currentPage = page
    this.handleSearchAccount()
  }

  goToNewAccount() {
    this.router.navigateByUrl('/admin/new-account')
  }
}
