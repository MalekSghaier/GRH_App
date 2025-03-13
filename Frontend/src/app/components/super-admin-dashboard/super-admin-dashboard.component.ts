import { Component, AfterViewInit ,ViewEncapsulation , OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';


@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl:'./super-admin-dashboard.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation
})
export class SuperAdminDashboardComponent implements AfterViewInit , OnInit {

  totalCompanies: number = 0;
  totalEmployees: number = 0;
  totalInterns: number = 0;
  constructor(private statisticsService: StatisticsService) {}


  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe(
      (data) => {
        this.totalCompanies = data.totalCompanies;
        this.totalEmployees = data.totalEmployees;
        this.totalInterns = data.totalInterns;
      },
      (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
      },
    );
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeSearch();
    this.initializeDarkMode();
    this.initializeMenus();
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

  
  private initializeSearch(): void {
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (searchButton && searchButtonIcon && searchForm) {
      searchButton.addEventListener('click', function (e) {
        if (window.innerWidth < 768) {
          e.preventDefault();
          searchForm.classList.toggle('show');
          if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
          } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
          }
        }
      });
    }
  }

  private initializeDarkMode(): void {
    const switchMode = document.getElementById('switch-mode') as HTMLInputElement | null;

    if (switchMode) {
      switchMode.addEventListener('change', function () {
        if (this.checked) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });
    }
  }

  private initializeMenus(): void {
    const notificationIcon = document.querySelector('.notification');
    const notificationMenu = document.querySelector('.notification-menu');
    const profileIcon = document.querySelector('.profile');
    const profileMenu = document.querySelector('.profile-menu');

    if (notificationIcon && notificationMenu) {
      notificationIcon.addEventListener('click', function () {
        notificationMenu.classList.toggle('show');
        if (profileMenu) {
          profileMenu.classList.remove('show');
        }
      });
    }

    if (profileIcon && profileMenu) {
      profileIcon.addEventListener('click', function () {
        profileMenu.classList.toggle('show');
        if (notificationMenu) {
          notificationMenu.classList.remove('show');
        }
      });
    }

    window.addEventListener('click', function (e) {
      const target = e.target as HTMLElement;
      if (notificationMenu && profileMenu) {
        if (!target.closest('.notification') && !target.closest('.profile')) {
          notificationMenu.classList.remove('show');
          profileMenu.classList.remove('show');
        }
      }
    });
  }
}