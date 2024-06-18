import {Component, OnInit} from '@angular/core';
import {Chart, ChartData, ChartOptions, ChartType, LineController, LineElement, PointElement} from "chart.js";
import {AccountOperationService} from "../../services/account-operation.service";
import {AccountOperation} from "../../models/account.model";
import moment from 'moment';
export interface OperationGroup {
  date: string; // Formatted date for x-axis
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
  public lineChartLabels: string[] = [];
  public lineChartType: 'line' = 'line'; // Ensure 'line' for Chart.js v2
  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        label: 'Debit Accounts',
        data: []
      },
      {
        label: 'Credit Accounts',
        data: []
      }
    ]
  };

  constructor(private operationService: AccountOperationService) {}

  ngOnInit(): void {
    Chart.register(LineController,LineElement,PointElement)
    this.operationService.getOperations()
      .subscribe(operations => {
        // Group operations by date and calculate totals
        const operationGroups = this.groupAndSumOperations(operations.map(operation => {
          // Extract labels and data for chart
          this.lineChartLabels = operationGroups.map(group => group.date);
          this.lineChartData.datasets[0].data = operationGroups.map(group => group.creditAmount) as number[]; // Explicit type cast
          this.lineChartData.datasets[1].data = operationGroups.map(group => group.debitAmount) as number[]; // Explicit type cast
          this.lineChartData= {
            labels: this.lineChartLabels,
            datasets: [
              {
                label: 'Debit Accounts',
                data: []
              },
              {
                label: 'Credit Accounts',
                data: []
              }
            ]
          };
          return { ...operation, operationDate: moment(operation.operationDate).toDate() };
        }));





      });
  }

  groupAndSumOperations(operations: AccountOperation[]) {
    const operationGroups: OperationGroup[] = [];
    // Group operations by date
    const groupedByDate = operations.reduce((acc:{[Key:string]:OperationGroup}, operation) => {
      const dateString = operation.operationDate.toLocaleDateString(); // Format date
      if (!acc[dateString]) {
        acc[dateString] = { date: dateString, creditAmount: 0, debitAmount: 0 };
      }
      if (operation.type === 'CREDIT') {
        acc[dateString].creditAmount += operation.amount;
      } else if (operation.type === 'DEBIT') {
        acc[dateString].debitAmount += operation.amount;
        console.log("debit amount",acc)
      }
      return acc;
    }, {});

    // Convert grouped object to array
    for (const key in groupedByDate) {
      operationGroups.push(groupedByDate[key]);
    }

    return operationGroups;
  }
}
