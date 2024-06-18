import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent implements OnInit {
  username!: string;
  addRoleToUserForm!: FormGroup;

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
  }


  handleAddRole() {
    let role = this.addRoleToUserForm.value.role
    this.userService.AddRoleToUser(this.username,role).subscribe({
      next: value => {
        alert("role was added successfully!")
        console.log(value)
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
