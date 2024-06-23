import {Component, OnInit} from '@angular/core';
import {Chart, ChartData, ChartOptions, ChartType, LineController, LineElement, PointElement} from "chart.js";
import {AccountOperationService} from "../../services/account-operation.service";
import {AccountOperation} from "../../models/account.model";
import moment from 'moment';

export interface OperationGroup {
  date: string;
  creditAmount: number;
  debitAmount: number;
}

@Component({
  selector: 'app-line-chart-operations',
  templateUrl: './line-chart-operations.component.html',
  styleUrl: './line-chart-operations.component.css'
})
export class LineChartOperationsComponent implements OnInit {

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLabels: string[] = ['Credit Operations', 'Debit Operations'];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        label: 'Total Amount (Credit)',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Total Amount (Debit)',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      }
    ]
  };

  constructor(private operationService: AccountOperationService) {
  }

  ngOnInit(): void {
    Chart.register(LineController, LineElement, PointElement)
    this.getOperationsByCreatedDate();


  }

  getOperationsByCreatedDate() {
    this.operationService.getOperations().subscribe({
      next: operations => {
        const operationGroups = this.groupAndSumOperations(operations);
        this.lineChartLabels = operationGroups.map(group => group.date);
        this.lineChartData.datasets[0].data = operationGroups.map(group => group.creditAmount) as number[];
        this.lineChartData.datasets[1].data = operationGroups.map(group => group.debitAmount) as number[];

        this.lineChartData = {
          labels: this.lineChartLabels,
          datasets: [
            {
              label: 'Total Amount (Credit)',
              data: this.lineChartData.datasets[0].data,
              fill: false,
              borderColor: 'blue',
              backgroundColor: 'rgba(5,241,18,0.96)',
              tension: 0.5
            },
            {
              label: 'Total Amount (Debit)',
              data: this.lineChartData.datasets[1].data,
              fill: false,
              borderColor: 'black',
              backgroundColor: 'rgba(246,14,14,0.99)',
              tension: 0.5
            }
          ]
        }

      },
      error: err => {
        console.error('Error fetching operations:', err);
      }
    })
  }

  groupAndSumOperations(operations: AccountOperation[]) {
    const operationGroups: OperationGroup[] = [];
    // Group operations by date
    const groupedByDate = operations.reduce((acc: { [Key: string]: OperationGroup }, operation) => {
      const date = new Date(operation.operationDate);
      const dateString = date.toLocaleDateString(); // Format date
      if (!acc[dateString]) {
        acc[dateString] = {date: dateString, creditAmount: 0, debitAmount: 0};
      }
      if (operation.type === 'CREDIT') {
        acc[dateString].creditAmount += operation.amount;
        console.log("credit amount", acc)
      } else if (operation.type === 'DEBIT') {
        acc[dateString].debitAmount += operation.amount;
        console.log("debit amount", acc)
      }
      return acc;
    }, {});


    for (const key in groupedByDate) {
      operationGroups.push(groupedByDate[key]);
    }

    return operationGroups;
  }
}
