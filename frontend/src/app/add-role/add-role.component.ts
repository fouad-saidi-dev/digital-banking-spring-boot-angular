import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, Observable, throwError} from "rxjs";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent implements OnInit {
  username!: string;
  addRoleToUserForm!: FormGroup;
  roles!: Observable<Array<any>>;

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
  }


  handleAddRole() {
    let role = this.addRoleToUserForm.value.role
    this.userService.addRoleToUser(this.username, role).subscribe({
      next: value => {
        alert("role was added successfully!")
        console.log(value)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  getRoles() {
    this.roles = this.userService.getRolesUser(this.username).pipe(
      catchError(err => {
        return throwError(err);
      })
    )
  }

  handleRemoveRole(role: string) {
    this.userService.removeRoleFromUser(this.username, role).subscribe({
      next: value => {
        this.getRoles()
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
