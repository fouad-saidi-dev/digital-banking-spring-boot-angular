import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {
  newUserForm!: FormGroup;
  isAlert: boolean = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.newUserForm = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required, Validators.min(3)]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      password: this.formBuilder.control('', [Validators.required, Validators.min(4)])
    })
  }

  handeSaveUser() {
    let user = this.newUserForm.value
    this.userService.addUser(user).subscribe({
      next: value => {
        //alert("User has been saved successfully!")
        this.isAlert = true
        console.log(value)
        setTimeout(() => {
          this.isAlert = false
        },4000);
      },
      error: err => {
        console.log('Error save user!', err)
      }
    })
  }
}
