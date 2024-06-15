import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {User} from "../models/user.module";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  showPassword: boolean = false
  typeInput!: string;
  passwordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: this.formBuilder.control('', Validators.required)
    })
  }

  showPasswords() {
    if (!this.showPassword) {
      this.typeInput = 'text';
      this.showPassword = true;
    } else {
      this.typeInput = 'password';
      this.showPassword = false;
    }
  }

  handleEditPassword() {
    let user: User = this.passwordForm.value
    this.authService.editPassword(this.authService.username,user).subscribe({
      next:user=>{
        alert("Password has been successfully updated!");
      },
      error:err => {
        console.log(err)
      }
    })
  }
}
