import { Component, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CalendarComponent } from '../calendar/calendar.component';
import { AuthService } from '../../services/auth.service';
import { PonctualiteWidgetComponent } from '../../ponctualite-widget/ponctualite-widget.component';
import { PointageStatsChartComponent } from '../../pointage-stats-chart/pointage-stats-chart.component';
import { UserService } from '../../services/user.service';
import { CongesStatsChartComponent } from '../../conges-stats-chart/conges-stats-chart.component';
import { Chart, ChartTypeRegistry } from 'chart.js';







interface Holiday {
  name: string;
  date: Date;
}
@Component({
  selector: 'app-employee-dashboard',
  imports: [
    SharedNavbarComponent,
    SharedSidebarComponent,
    CommonModule,
    CalendarComponent,
    PonctualiteWidgetComponent ,
    PointageStatsChartComponent ,
    CongesStatsChartComponent
],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation
})
export class EmployeeDashboardComponent implements AfterViewInit, OnInit {
  isPresent: boolean = true; 
  currentTimeIcon: string = '🌞';
  remainingTime: string = '2h15';
  shiftProgress: number = 65; 
  currentTime: string = '';
  currentDate: string = '';
  officeTemperature: number = 0;
  nextHoliday: Holiday = {
    name: '',
    date: new Date()
  };
  arrivedCount: number = 0;
  currentUserId: string = '';
  soldeConges: number = 0;




  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService:UserService
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
    }
  }

  
  getCircleOffset(): number {
    const circumference = 2 * Math.PI * 50; // Correspond au rayon (r) du cercle
    return circumference - (Math.round(this.shiftProgress) / 100) * circumference;
  }

  ngOnInit(): void {
    this.updateTime();
    this.calculateShiftProgress();
    this.loadEnvironmentData();
    this.calculateNextHoliday();
    this.loadSoldeConges();


  setInterval(() => {
    this.updateTime();
    this.calculateShiftProgress();
  }, 60000);

  }

    loadSoldeConges(): void {
    if (this.currentUserId) {
      this.userService.getSoldeConges(this.currentUserId).subscribe({
        next: (data) => {
          this.soldeConges = data.soldeConges;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du solde de congés', err);
        }
      });
    }
  }

  loadEnvironmentData(): void {
  this.arrivedCount = 1;
  }

    calculateNextHoliday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filtrer les jours fériés à venir
    const upcomingHolidays = this.tunisiaHolidays
      .filter(h => new Date(h.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcomingHolidays.length > 0) {
      this.nextHoliday = upcomingHolidays[0];
    } else {
      // Si aucun jour férié restant cette année, prendre le premier de l'année suivante
      this.nextHoliday = {
        name: 'Jour de l\'an',
        date: new Date(today.getFullYear() + 1, 0, 1)
      };
    }
  }
  private updateTime(): void {
    const now = new Date();
    
    // Formatage de l'heure
    this.currentTime = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Formatage de la date
    this.currentDate = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
  private calculateShiftProgress(): void {
    const now = new Date();
    const startHour = 8;
    const endHour = 17;
    const totalHours = endHour - startHour;
    
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    const hoursWorked = currentHour - startHour;
    
    // Arrondi sans décimales
    this.shiftProgress = Math.round(Math.min(100, Math.max(0, (hoursWorked / totalHours) * 100)));
    
    const remainingHours = totalHours - hoursWorked;
    if (remainingHours > 0) {
      const hours = Math.floor(remainingHours);
      const minutes = Math.round((remainingHours - hours) * 60);
      this.remainingTime = `${hours}h ${minutes}m`;
    } else {
      this.remainingTime = '0h 0m';
    }
  }
  tunisiaHolidays: Holiday[] = [
    { name: 'Jour de l\'an', date: new Date('2025-01-01') },
    { name: 'Fête de la Révolution', date: new Date('2025-01-14') },
    { name: 'Fête de l\'Indépendance', date: new Date('2025-03-20') },
    { name: 'Fête du Travail', date: new Date('2025-05-01') },
    { name: 'Fête de la République', date: new Date('2025-07-25') },
    { name: 'Fête de la Femme', date: new Date('2025-08-13') },
    { name: 'Aïd el-Fitr', date: new Date('2025-04-21') }, // Date variable
    { name: 'Aïd el-Adha', date: new Date('2025-06-08') }, // Date variable
    { name: 'Mouled', date: new Date('2025-09-04') }, // Date variable
  ];

  ngAfterViewInit(): void {
    this.initializeSidebar();
  }

  private initializeSidebar(): void {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

    allSideMenu.forEach(item => {
      const li = item.parentElement;

      if (li) {
        item.addEventListener('click', function () {
          allSideMenu.forEach(i => {
            if (i.parentElement) {
              i.parentElement.classList.remove('active');
            }
          });
          li.classList.add('active');
        });
      }
    });

    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    if (menuBar && sidebar) {
      menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
      });
    }

    window.addEventListener('load', this.adjustSidebar);
    window.addEventListener('resize', this.adjustSidebar);
  }

  private adjustSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (window.innerWidth <= 576) {
        sidebar.classList.add('hide');
        sidebar.classList.remove('show');
      } else {
        sidebar.classList.remove('hide');
        sidebar.classList.add('show');
      }
    }
  }

  printDashboard(): void {
  // Préparation des données
  document.body.setAttribute('data-print-date', new Date().toLocaleString('fr-FR'));
  
  // Créer un conteneur spécial pour l'impression
  const printContainer = document.createElement('div');
  printContainer.className = 'print-container';

  // Première ligne : Statut actuel et Score de Ponctualité
  const firstRow = document.createElement('div');
  firstRow.className = 'print-row';
  
  // Section Statut actuel
  const statusSection = this.createStatSection(
    'Statut actuel', 
    this.isPresent ? 'Présent' : 'Absent',
    this.isPresent ? '🟢' : '🔴'
  );
  firstRow.appendChild(statusSection);
  


  // Ajouter le conteneur au body
  document.body.appendChild(printContainer);
  document.body.classList.add('print-mode');

  // Forcer la mise à jour des graphiques
  setTimeout(() => {
    // Imprimer après un court délai
    setTimeout(() => {
      window.print();
      
      // Nettoyage
      printContainer.remove();
      document.body.classList.remove('print-mode');
      document.body.removeAttribute('data-print-date');
    }, 500);
  }, 100);
}

private createStatSection(title: string, value: string, icon: string = ''): HTMLElement {
  const section = document.createElement('div');
  section.className = 'print-section stat-section';
  
  const iconDiv = document.createElement('div');
  iconDiv.className = 'stat-icon';
  iconDiv.textContent = icon;
  iconDiv.style.fontSize = '24px';
  iconDiv.style.textAlign = 'center';
  iconDiv.style.marginBottom = '0px';
  
  const valueDiv = document.createElement('div');
  valueDiv.className = 'stat-value';
  valueDiv.textContent = value;
  valueDiv.style.fontSize = '20px';
  valueDiv.style.fontWeight = 'bold';
  valueDiv.style.textAlign = 'center';
  valueDiv.style.margin = '0px 0';
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'stat-title';
  titleDiv.textContent = title;
  titleDiv.style.textAlign = 'center';
  titleDiv.style.fontSize = '16px';
  titleDiv.style.color = '#555';
  
  section.appendChild(iconDiv);
  section.appendChild(valueDiv);
  section.appendChild(titleDiv);
  
  return section;
}

}
