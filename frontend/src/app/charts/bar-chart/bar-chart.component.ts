import {Component, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  ChartType,
  LinearScale, Title
} from "chart.js";
import {CustomerService} from "../../services/customer.service";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit {
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true
  }
  public barChartLabels: string[] = []
  public barChartType: ChartType = 'bar'
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartData<'bar',number[]> = {
    labels: this.barChartLabels,
    datasets: []
  };

  constructor(private customerService: CustomerService,private accountService:AccountService) {
  }

  ngOnInit(): void {
    Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title);
    console.log('Chart type:', this.barChartType);
    //this.getCustomers()
    this.getAccounts()
  }
  getAccounts(){
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {

        let customerAccountCounts : { [key: string]: number } = {};

        accounts.forEach((account) => {
          if (account.customerDTO.name in customerAccountCounts) {
            customerAccountCounts[account.customerDTO.name]++;
          } else {
            customerAccountCounts[account.customerDTO.name] = 1;
          }
        })

        let countAccountsOfCustomers = accounts.map(value => value.customerDTO.name).filter((value,index,self) => self.indexOf(value) === index).length
        this.barChartLabels = Object.keys(customerAccountCounts);
        const data = Object.values(customerAccountCounts);
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              label: 'Account counts of customers',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        }
      }
    })
  }

  /*getCustomers() {
    this.customerService.getCustomers().subscribe({
      next: customers => {
        this.barChartLabels = customers.map(customer => customer.name)
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              label: 'Customer IDs',
              data: customers.map(customer => customer.id),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        }
      }
    })
  }*/
}
