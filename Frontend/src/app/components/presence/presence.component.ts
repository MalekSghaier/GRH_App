import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PointageService } from '../../services/pointage.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { InitialsPipe } from '../../pipes/initials.pipe';
import moment from 'moment';


@Component({
  selector: 'app-presence',
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, MatTableModule, MatCardModule,InitialsPipe],
  templateUrl: './presence.component.html',
  styleUrl: './presence.component.css',
  encapsulation: ViewEncapsulation.None
  
})
export class PresenceComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['nomComplet', 'date', 'entree', 'sortie', 'heuresTravail'];
  dataSource: any[] = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];
  today = new Date().toLocaleDateString('fr-FR');
  arrivedCount = 0;
  averageHours = 0;
  filter: 'all' | 'present' | 'left' = 'all';
  selectedDate: string = moment().format('YYYY-MM-DD');


  constructor(
    private pointageService: PointageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPresence();
  }

  loadPresence(date?: string): void {
  const loadDate = date || this.selectedDate;
  
  this.pointageService.getPointagesByDate(loadDate).subscribe({
    next: (data) => {
      this.employees = data.map(emp => ({
        ...emp,
        heuresTravail: emp.heuresTravail ? parseFloat(emp.heuresTravail.toFixed(2)) : null
      }));
      this.updateStats();
      this.filterByStatus('all');
      this.today = new Date(loadDate).toLocaleDateString('fr-FR'); // Mise à jour de la date affichée
    },
    error: (err) => console.error('Erreur chargement présence', err)
  });
}

onDateChange(event: any): void {
  this.selectedDate = moment(event.target.value).format('YYYY-MM-DD');
  this.loadPresence(this.selectedDate);
}
  // loadPresence(): void {
  //   this.pointageService.getPresenceAujourdhui().subscribe({
  //     next: (data) => {
  //       this.employees = data.map(emp => ({
  //         ...emp,
  //         heuresTravail: emp.heuresTravail ? parseFloat(emp.heuresTravail.toFixed(2)) : null
  //       }));
  //       this.updateStats();
  //       this.filterByStatus('all');
  //     },
  //     error: (err) => console.error('Erreur chargement présence', err)
  //   });
  // }

    updateStats(): void {
    this.arrivedCount = this.employees.length;
    
    const employeesWithHours = this.employees.filter(e => e.heuresTravail);
    if (employeesWithHours.length > 0) {
      const totalHours = employeesWithHours.reduce((sum, emp) => sum + emp.heuresTravail, 0);
      this.averageHours = parseFloat((totalHours / employeesWithHours.length).toFixed(1));
    }
  }

    filterByStatus(status: 'all' | 'present' | 'left'): void {
    this.filter = status;
    switch(status) {
      case 'present':
        this.filteredEmployees = this.employees.filter(emp => !emp.sortie);
        break;
      case 'left':
        this.filteredEmployees = this.employees.filter(emp => !!emp.sortie);
        break;
      default:
        this.filteredEmployees = [...this.employees];
    }
  }

    getHoursPercentage(emp: any): number {
    if (!emp.heuresTravail) return 0;
    // Supposons une journée standard de 8h
    return Math.min((emp.heuresTravail / 8) * 100, 100);
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
