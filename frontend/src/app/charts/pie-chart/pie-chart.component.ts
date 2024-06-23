import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {CustomerService} from "../../services/customer.service";
import BaseChartDirective from "ng2-charts"
import {
  ArcElement,
  Chart,
  ChartData,
  ChartOptions,
  ChartType, Legend, PieController, Tooltip
} from "chart.js";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true
  }
  public pieChartLabels: string[] = ['Current Account','Saving Account']
  public pieChartType: ChartType = 'pie'
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        label:'Accounts',
        data:[0,0],
        backgroundColor:['#FFBB99', '#FFCC99']
      }
    ]
  };

  constructor(private accountService: AccountService, private customerService: CustomerService) {
  }

  ngOnInit(): void {
    Chart.register(PieController, ArcElement, Tooltip, Legend);
    console.log('Chart type:', this.pieChartType);
    console.log('Data :',this.pieChartData.datasets.map(m => m.data.map(d => console.log('dataaa',d))))
    this.getAccounts()
  }

  getAccounts() {
    this.accountService.getAccounts().subscribe({
      next:accounts=>{
        const savingAccount = accounts.filter(account => account.type === 'SavingAccount').length;
        const currentAccount = accounts.filter(account => account.type === 'CurrentAccount').length;
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [
            {
              label: 'Accounts',
              data:[currentAccount,savingAccount],
              backgroundColor: ['#FFBB99', '#FFCC99']
            }
          ]
        }
      },
      error:err => {
        console.error('Error fetching accounts:', err);
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
              backgroundColor: ['#FFBB99', '#FFCC99', '#FFDD99']
            }
          ]
        }
      }
    })
  }*/
}
