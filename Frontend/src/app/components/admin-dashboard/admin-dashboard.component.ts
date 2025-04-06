import { Component, AfterViewInit ,ViewEncapsulation,OnInit  } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SharedNavbarComponent,SharedSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class AdminDashboardComponent implements AfterViewInit,OnInit {

  employeeCount: number = 0;
  internCount: number = 0;

  constructor(private userService: UserService) {}



  ngOnInit(): void {
    this.loadCounts();
  }
  ngAfterViewInit(): void {
    this.initializeSidebar();
 
  }

  private loadCounts(): void {
    this.userService.countEmployees().subscribe({
      next: (count) => this.employeeCount = count,
      error: (err) => console.error('Erreur lors du chargement des employés', err)
    });

    this.userService.countInterns().subscribe({
      next: (count) => this.internCount = count,
      error: (err) => console.error('Erreur lors du chargement des stagiaires', err)
    });
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
