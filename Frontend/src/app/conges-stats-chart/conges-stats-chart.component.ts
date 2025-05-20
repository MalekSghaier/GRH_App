import { Component, Input, OnInit } from '@angular/core';
import { CongesService } from '../services/conges.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-conges-stats-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="conges-stats-widget">
      <div class="widget-header">
        <i class="fas fa-history"></i>
        <h3>Historique des Congés</h3>
      </div>
      
      <div class="chart-container">
        <p-chart type="bar" [data]="chartData" [options]="chartOptions"></p-chart>
      </div>
    </div>
  `,
  styles: [`
    .conges-stats-widget {
      background: white;
      border-radius: 12px;
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .widget-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .widget-header i {
      font-size: 1.5rem;
      margin-right: 10px;
      color: #1a84ef;
    }
    
    .widget-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }
    
    .chart-container {
      flex-grow: 1;
      min-height: 200px;
    }
  `]
})
export class CongesStatsChartComponent implements OnInit {
  @Input() userId: string = '';
  
  chartData: any;
  chartOptions: any;

  constructor(private congesService: CongesService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadData();
    }
    this.initChartOptions();
  }

  loadData(): void {
    this.congesService.getUserCongesStats(this.userId).subscribe({
      next: (data) => {
        this.updateChartData(data);
      },
      error: (err) => {
        console.error('Error loading conges stats', err);
      }
    });
  }

  initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    };
  }

  updateChartData(data: any): void {
    this.chartData = {
      labels: ['Approuvés', 'En attente', 'Refusés'],
      datasets: [
        {
          label: 'Demandes de congé',
          data: [data.approved, data.pending, data.rejected],
          backgroundColor: [
            '#1a84ef',  
            '#5aa8f2',  
            '#9ac8f7'   
          ],
          borderColor: [
            '#1a84ef',
            '#5aa8f2',
            '#9ac8f7'
          ],
          borderWidth: 1
        }
      ]
    };
  }
}