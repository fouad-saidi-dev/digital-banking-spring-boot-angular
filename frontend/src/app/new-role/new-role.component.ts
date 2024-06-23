import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {catchError, Observable, throwError, timeout} from "rxjs";
import {Role} from "../models/role.model";

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrl: './new-role.component.css'
})
export class NewRoleComponent implements OnInit {
  formRole!: FormGroup;
  isAlert: boolean = false;
  roles!: Observable<Array<Role>>;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder) {
  }


  ngOnInit(): void {
    this.formRole = this.formBuilder.group({
      role: this.formBuilder.control('', Validators.required)
    })
    this.formRole.get('role')?.valueChanges.subscribe(value => {
      const uppercaseValue = value.toUpperCase();
      this.formRole.get('role')?.setValue(uppercaseValue, {emitEvent: false});
    });
    this.getRoles()
  }

  getRoles() {

    this.roles = this.userService.getRoles().pipe(
      catchError(err => {
        console.log(err)
        return throwError(err);
      })
    )
  }

  handleSaveRole() {

    let role = this.formRole.value

    this.userService.saveRole(role).subscribe({
      next: role => {
        this.isAlert = true
        this.getRoles()
        console.log(role)
        setTimeout(() => {
          this.isAlert = false
        },4000);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  handleDeleteRole(role: Role) {
    if (confirm("Are you sure you want to delete role " + role.role + "?")) {
      this.userService.deleteRole(role).subscribe({
        next: role => {
          this.getRoles()
          console.log(role)
          this.formRole.reset()
        },
        error: err => {
          console.log(err)
        }
      })
    }
  }
}
