import { Component, Input, OnInit } from '@angular/core';
import { PointageService } from '../services/pointage.service';
import { PonctualiteData } from '../models/ponctualite.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ponctualite-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ponctualite-widget" 
         [class.high-score]="data.score >= 80"
         [class.medium-score]="data.score >= 50 && data.score < 80"
         [class.low-score]="data.score < 50">
      <div class="widget-header">
        <i class="fas fa-stopwatch"></i>
        <h3>Score de Ponctualité</h3>
      </div>
      
      <div class="score-display">
        <div class="score-value">{{ data.score }}<span class="percent">%</span></div>
        <div class="score-progress">
          <div class="progress-bar" [style.width.%]="data.score"></div>
        </div>
      </div>
      
      <div class="score-details">
        <div class="detail-item">
          <i class="fas fa-check-circle"></i>
          <span>{{ data.onTimeDays }} jours à l'heure</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-calendar-alt"></i>
          <span>Sur {{ data.totalDays }} jours</span>
        </div>
      </div>
      
      <div class="last-updated" *ngIf="data.lastUpdated">
        Mis à jour: {{ data.lastUpdated | date:'dd/MM/yyyy HH:mm' }}
      </div>
    </div>
  `,
  styles: [`
    /* Vos styles existants restent inchangés */
    .ponctualite-widget {
      background: white;
      border-radius: 12px;
      margin-bottom:1px;
      margin-top:-12px;
      margin-right:-10px;
      margin-left:-10px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }
    
    .widget-header {
      display: flex;
      align-items: center;
      margin-bottom: 1px;
    }
    
    .widget-header i {
      font-size: 1.5rem;
      margin-right: 10px;
      color: #4a6cf7;
    }
    
    .widget-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }
    
    .score-display {
      margin-bottom: 15px;
    }
    
    .score-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0px;
    }
    
    .percent {
      font-size: 1.5rem;
      font-weight: 400;
    }
    
    .score-progress {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: #4a6cf7;
      transition: width 0.5s ease;
    }
    
    .score-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 1px;
      
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #666;
    }
    
    .detail-item i {
      margin-right: 8px;
      width: 20px;
      text-align: center;
    }
    
    .last-updated {
      font-size: 0.75rem;
      color: #999;
      text-align: right;
    }
    
    /* Couleurs en fonction du score */
    .high-score {
      border-left: 4px solid #1a84ef;
    }
    
    .medium-score {
      border-left: 4px solid #FFC107;
    }
    
    .low-score {
      border-left: 4px solid #F44336;
    }
    
    .high-score .progress-bar {
      background: #1a84ef;
    }
    
    .medium-score .progress-bar {
      background: #FFC107;
    }
    
    .low-score .progress-bar {
      background: #F44336;
    }
    
    .high-score .widget-header i {
      color: #1a84ef;
    }
    
    .medium-score .widget-header i {
      color: #FFC107;
    }
    
    .low-score .widget-header i {
      color: #F44336;
    }
  `]
})
export class PonctualiteWidgetComponent implements OnInit {
  @Input() userId: string = '';
  data: PonctualiteData = {
    score: 0,
    totalDays: 0,
    onTimeDays: 0
  };

  constructor(private pointageService: PointageService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadPonctualiteData();
    }
  }

  loadPonctualiteData(): void {
    this.pointageService.getPonctualiteScore(this.userId).subscribe({
      next: (data) => {
        this.data = {
          ...data,
          lastUpdated: new Date()
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement du score de ponctualité', err);
      }
    });
  }
}