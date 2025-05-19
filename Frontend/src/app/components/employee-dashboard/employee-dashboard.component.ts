import { Component, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  imports: [SharedNavbarComponent,SharedSidebarComponent,CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation
})
export class EmployeeDashboardComponent implements AfterViewInit, OnInit {
  isPresent: boolean = true; // À remplacer par la logique réelle
  currentTimeIcon: string = '🌞';
  remainingTime: string = '2h15';
  shiftProgress: number = 65; // Pourcentage de progression
  currentTime: string = '';
  currentDate: string = '';
  
  getCircleOffset(): number {
    const circumference = 2 * Math.PI * 50; // Correspond au rayon (r) du cercle
    return circumference - (Math.round(this.shiftProgress) / 100) * circumference;
  }

    ngOnInit(): void {
    this.updateTime();
    this.calculateShiftProgress();
    
    // Mettre à jour toutes les minutes
    setInterval(() => {
      this.updateTime();
      this.calculateShiftProgress();
    }, 60000);
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
}
