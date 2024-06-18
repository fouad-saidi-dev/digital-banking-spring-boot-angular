import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {User} from "../models/user.module";
import {UserService} from "../services/user.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  public users!:Observable<Array<User>>
  constructor(private router: Router,private userService:UserService) {
  }

  ngOnInit(): void {
    this.users=this.userService.getUsers().pipe(
      catchError(err => {
        console.log(err)
        return throwError(err);
      })
    )
  }

  goToNewUser() {
    this.router.navigateByUrl("/admin/new-user")
  }

  goToAddRole(user:User) {
    this.router.navigateByUrl(`/admin/add-role-user/${user.username}`)
  }
}
