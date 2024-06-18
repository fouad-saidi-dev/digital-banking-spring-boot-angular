import {Component, OnInit} from '@angular/core';
import {ChartData, ChartOptions, ChartType} from "chart.js";
import {AccountOperationService} from "../../services/account-operation.service";

@Component({
  selector: 'app-pie-chart-operations',
  templateUrl: './pie-chart-operations.component.html',
  styleUrl: './pie-chart-operations.component.css'
})
export class PieChartOperationsComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true
  }
  public pieChartLabels: string[] = ['Debit', 'Credit']
  public pieChartType: ChartType = 'pie'
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        label: 'Accounts Type',
        data: [0, 0],
        backgroundColor: ['#FFBB99', '#FFCC99']
      }
    ]
  };

  constructor(private operationService: AccountOperationService) {
  }

  ngOnInit(): void {
    this.getOperations()
  }

  getOperations() {
    this.operationService.getOperations().subscribe({
      next: operations => {
        const debit = operations.filter(operation => operation.type === 'DEBIT').length;
        const credit = operations.filter(operation => operation.type === 'CREDIT').length;
        console.log('Credit',credit)
        console.log('Credit',debit)
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [
            {
              label: 'Accounts Type',
              data: [debit, credit],
              backgroundColor: ['#161895', '#e70d37']
            }
          ]
        }
      },
      error:err => {
        console.error('Error fetching operations:', err);
      }
    })
  }
}
