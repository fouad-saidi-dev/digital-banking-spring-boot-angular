import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../models/customer.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../services/customer.service";

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit {
  customerId!: number;
  editCustomerForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private customerService: CustomerService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.params['id']
    this.customerService.getCustomerById(this.customerId).subscribe({
      next:(customer:Customer) => {
        console.log(customer)
        this.editCustomerForm = this.formBuilder.group({
          id: this.formBuilder.control(customer.id),
          name: this.formBuilder.control(customer.name,Validators.required),
          email: this.formBuilder.control(customer.email,[Validators.required,Validators.email])
        })
      },
      error:err => {
        console.log(err)
      }
    })
  }

  handleEditCustomer() {
    let customer: Customer = this.editCustomerForm.value
    this.customerService.editCustomer(customer).subscribe({
      next: value => {
        alert("Customer has been successfully updated!");
        this.router.navigateByUrl('/customers')
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
