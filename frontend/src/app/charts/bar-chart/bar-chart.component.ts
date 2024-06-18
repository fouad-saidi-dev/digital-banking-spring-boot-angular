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
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: []
  };

  constructor(private customerService: CustomerService) {
  }

  ngOnInit(): void {
    Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title);
    console.log('Chart type:', this.barChartType);
    this.getCustomers()
  }

  getCustomers() {
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
  }
}
