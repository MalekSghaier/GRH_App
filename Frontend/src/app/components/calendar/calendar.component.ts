import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointageService } from '../../services/pointage.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @Input() userId: string = '';
  days: any[] = [];
  currentMonth: number;
  currentYear: number;
  monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
               "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  constructor(private pointageService: PointageService) {
    const now = new Date();
    this.currentMonth = now.getMonth() + 1;
    this.currentYear = now.getFullYear();
  }

  ngOnInit(): void {
    this.loadCalendar();
  }

  loadCalendar(): void {
    this.pointageService.getWorkingDays(this.userId, this.currentMonth, this.currentYear)
      .subscribe(data => {
        this.generateCalendar(data);
      });
  }

  generateCalendar(workingDays: any[]): void {
    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth, 0);
    
    // Créer un objet pour un accès rapide aux jours travaillés
    const workingDaysMap: Record<string, string> = {};
    workingDays.forEach(day => {
      workingDaysMap[day.date] = day.status;
    });

    this.days = [];
    
    // Ajouter les jours vides pour le premier jour du mois
    for (let i = 0; i < firstDay.getDay(); i++) {
      this.days.push({ day: null, status: null });
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateStr = `${this.currentYear}-${this.currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const status = workingDaysMap[dateStr] || 'absent';
      this.days.push({ day, status });
    }
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 1) {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.loadCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.loadCalendar();
  }

  getDayClass(status: string): string {
    switch(status) {
      case 'complet': return 'worked-full-day';
      case 'entree': return 'worked-half-day';
      default: return '';
    }
  }

  isToday(day: number | null): boolean {
  if (!day) return false;
  
  const today = new Date();
  return (
    day === today.getDate() && 
    this.currentMonth === today.getMonth() + 1 && 
    this.currentYear === today.getFullYear()
  );
}
}