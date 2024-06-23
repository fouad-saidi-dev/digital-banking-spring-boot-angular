import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../models/customer.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit {
  newCustomerForm!: FormGroup;

  constructor(private customerService: CustomerService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.newCustomerForm = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      email: this.formBuilder.control('', [Validators.required, Validators.email])
    })
  }

  handeSaveCustomer() {
    let customer: Customer = this.newCustomerForm.value
    this.customerService.saveCustomer(customer).subscribe({
      next: value => {
        alert("Customer has been successfully saved!");
        this.router.navigateByUrl('/admin/customers')
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
