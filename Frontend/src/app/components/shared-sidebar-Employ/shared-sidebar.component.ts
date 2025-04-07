import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Importez RouterModule
import { CongesService } from '../../services/conges.service';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { WorkApplicationsService } from '../../services/work-applications.service';
import { InternshipApplicationsService } from '../../services/internship-applications.service';

@Component({
  selector: 'app-shared-sidebar',
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Ajoutez RouterModule ici
  templateUrl: './shared-sidebar.component.html',
  styleUrls: ['./shared-sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SharedSidebarComponent implements AfterViewInit {



  



  constructor(
    private authService: AuthService, 

  ) {}


  
  logout(): void {
    this.authService.logout(); // Appelez la méthode logout
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeSearch();
    this.initializeDarkMode();
    this.initializeMenus();
  }

  private initializeSidebar(): void {
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if (menuBar && sidebar && content) {
      menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
        content.classList.toggle('sidebar-hidden');
      });
    }

    window.addEventListener('load', this.adjustSidebar);
    window.addEventListener('resize', this.adjustSidebar);
  }

  private adjustSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if (sidebar && content) {
      if (window.innerWidth <= 576) {
        sidebar.classList.add('hide');
        content.classList.add('sidebar-hidden');
      } else {
        sidebar.classList.remove('hide');
        content.classList.remove('sidebar-hidden');
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