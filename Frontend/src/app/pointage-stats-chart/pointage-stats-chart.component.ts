import { Component, Input, OnInit } from '@angular/core';
import { PointageService } from '../services/pointage.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pointage-stats-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="stats-chart-widget">
      <div class="widget-header">
        <i class="fas fa-chart-pie"></i>
        <h3>Méthodes de Pointage</h3>
      </div>
      
      <div class="chart-wrapper">
        <div class="chart-container">
          <p-chart type="doughnut" [data]="chartData" [options]="chartOptions" 
                  width="140" height="140"></p-chart>
        </div>
        
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color qr"></span>
            <span>QR Code ({{ data?.qrCount || 0 }})</span>
          </div>
          <div class="legend-item">
            <span class="legend-color face"></span>
            <span> Faciale ({{ data?.faceCount || 0 }})</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-chart-widget {
      background: transparent;
      border-radius: 12px;
      padding: 15px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .widget-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    
    .widget-header i {
      font-size: 1.2rem;
      margin-right: 8px;
      color: #1a84ef;
    }
    
    .widget-header h3 {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }
    
    .chart-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .chart-container {
      width: 140px;
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .chart-legend {
      display: flex;
      gap: 15px;
      margin-top: 10px;
      justify-content: center;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      color: #666;
    }
    
    .legend-color {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
    }
    
    .legend-color.qr {
      background-color: #8abdf0;
    }
    
    .legend-color.face {
      background-color: #1a84ef;
    }
  `]
})
export class PointageStatsChartComponent implements OnInit {
  @Input() userId: string = '';
  data: { qrCount: number; faceCount: number } = { qrCount: 0, faceCount: 0 };
  
  chartData: any;
  chartOptions: any;

  constructor(private pointageService: PointageService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadData();
    }
    this.initChartOptions();
  }

  loadData(): void {
    this.pointageService.getPointageStats(this.userId).subscribe({
      next: (data) => {
        this.data = data;
        this.updateChartData();
      },
      error: (err) => {
        console.error('Error loading pointage stats', err);
      }
    });
  }

  initChartOptions(): void {
    this.chartOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      },
      responsive: false,
      maintainAspectRatio: false
    };
  }

  updateChartData(): void {
    this.chartData = {
      labels: ['QR Code', 'Reconnaissance Faciale'],
      datasets: [
        {
          data: [this.data.qrCount, this.data.faceCount],
          backgroundColor: ['#8abdf0', '#1a84ef'],
          hoverBackgroundColor: ['#8abdf0', '#1a84ef'],
          borderWidth: 0
        }
      ]
    };
  }
}