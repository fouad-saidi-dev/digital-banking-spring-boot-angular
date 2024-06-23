import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, Observable, throwError} from "rxjs";
import {Role} from "../models/role.model";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent implements OnInit {
  username!: string;
  addRoleToUserForm!: FormGroup;
  rolesByUser!: Observable<Array<Role>>;
  roles!: Observable<Array<Role>>;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['id']
    this.addRoleToUserForm = this.formBuilder.group({
      username: this.formBuilder.control(this.username),
      role: this.formBuilder.control('', Validators.required)
    })
    this.getRoles()
    this.getRolesByUser()
  }


  handleAddRole() {
    let role = this.addRoleToUserForm.value.role
    this.userService.addRoleToUser(this.username, role).subscribe({
      next: value => {
        alert("role was added successfully!")
        this.getRolesByUser()
        console.log(value)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getRoles() {
    this.roles = this.userService.getRoles().pipe(
      catchError(err => {
        return throwError(err);
      })
    )
  }

  getRolesByUser() {
    this.rolesByUser = this.userService.getRolesUser(this.username).pipe(
      catchError(err => {
        return throwError(err);
      })
    )
  }

  handleRemoveRole(role: string) {
    if (confirm("Are you sure you want delete role " + role + " from user " + this.username + "?")) {
      this.userService.removeRoleFromUser(this.username, role).subscribe({
        next: value => {
          this.getRolesByUser()
        },
        error: err => {
          console.log(err)
        }
      })
    }
  }
}
