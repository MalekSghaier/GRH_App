import { Component, AfterViewInit,ViewEncapsulation,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule ,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';

@Component({
  selector: 'app-profil-employ',
  standalone: true,
  imports: [CommonModule, RouterModule,SharedNavbarComponent,SharedSidebarComponent], 
  templateUrl: './profil-employ.component.html',
  styleUrl: './profil-employ.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class ProfilEmployComponent implements AfterViewInit {

  currentRoute: string = '';

  constructor(private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  user: any;


  ngOnInit(): void {
    this.userService.getMyInfo().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      }
    );
  }
  logout(): void {
    this.authService.logout(); // Appelez la méthode logout
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
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
