import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomersComponent} from "./customers/customers.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {CustomerAccountsComponent} from "./customer-accounts/customer-accounts.component";
import {AuthorizationGuard} from "./guards/authorization.guard";
import {NotAuthorizedComponent} from "./not-authorized/not-authorized.component";
import {EditCustomerComponent} from "./edit-customer/edit-customer.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ProfileComponent} from "./profile/profile.component";
import {UsersComponent} from "./users/users.component";
import {NewUserComponent} from "./new-user/new-user.component";
import {NewRoleComponent} from "./new-role/new-role.component";
import {AddRoleComponent} from "./add-role/add-role.component";
import {NewBankAccountComponent} from "./new-bank-account/new-bank-account.component";
import {DisplayAccountsComponent} from "./display-accounts/display-accounts.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: "full"},
  {
    path: 'admin', component: AdminTemplateComponent,
    canActivate: [AuthenticationGuard],
    data: {role: "ADMIN"},
    children: [
      {path: 'customers', component: CustomersComponent},
      {path: 'accounts', component: AccountsComponent},
      {path: 'new-customer', component: NewCustomerComponent, canActivate: [AuthorizationGuard]},
      {path: 'customer-accounts/:id', component: CustomerAccountsComponent},
      {path: 'edit-customer/:id', component: EditCustomerComponent, canActivate: [AuthorizationGuard]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizationGuard]},
      {path: 'profile', component: ProfileComponent},
      {path: 'users', component: UsersComponent,canActivate: [AuthorizationGuard]},
      {path: 'new-user', component: NewUserComponent,canActivate: [AuthorizationGuard]},
      {path: 'new-role', component: NewRoleComponent,canActivate: [AuthorizationGuard]},
      {path: 'add-role-user/:id', component: AddRoleComponent,canActivate: [AuthorizationGuard]},
      {path: 'new-account', component: NewBankAccountComponent,canActivate: [AuthorizationGuard]},
      {path: 'display-accounts', component: DisplayAccountsComponent},
      {path: 'notAuthorized', component: NotAuthorizedComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
