import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CustomersComponent} from './customers/customers.component';
import {AccountsComponent} from './accounts/accounts.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NewCustomerComponent} from './new-customer/new-customer.component';
import {LoginComponent} from './login/login.component';
import {AdminTemplateComponent} from './admin-template/admin-template.component';
import {AppHttpInterceptor} from "./interceptors/app-http.interceptor";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {CustomerAccountsComponent} from './customer-accounts/customer-accounts.component';
import {EditCustomerComponent} from './edit-customer/edit-customer.component';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {AuthorizationGuard} from "./guards/authorization.guard";
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { ProfileComponent } from './profile/profile.component';
import {BaseChartDirective} from "ng2-charts";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CustomersComponent,
    AccountsComponent,
    NewCustomerComponent,
    LoginComponent,
    AdminTemplateComponent,
    CustomerAccountsComponent,
    EditCustomerComponent,
    NotAuthorizedComponent,
    DashboardComponent,
    BarChartComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BaseChartDirective
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true},
    AuthenticationGuard,
    AuthorizationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
