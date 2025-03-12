import { Component, AfterViewInit,ViewEncapsulation,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule ,NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class EditProfileComponent implements AfterViewInit, OnInit{
  currentRoute: string = '';
  editProfileForm: FormGroup;
  successMessage: string | null = null; // Variable pour le message de succès


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    // Initialisation du formulaire réactif
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  
    // Gestion de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }


  navigateToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }


  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur connecté
    this.userService.getMyInfo().subscribe(
      (user) => {
        this.editProfileForm.patchValue(user);
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      this.userService.updateProfile(this.editProfileForm.value).subscribe(
        (data) => {
          this.successMessage = 'Profil mis à jour avec succès !'; 
          setTimeout(() => {
            this.router.navigate(['/profil']); 
          }, 700); 
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du profil', error);
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/profile']);
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
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationMenu = document.getElementById('notificationMenu');
    const profileIcon = document.getElementById('profileIcon');
    const profileMenu = document.getElementById('profileMenu');

    if (notificationIcon && notificationMenu) {
        notificationIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }
        });
    }

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            profileMenu.classList.toggle('show');
            if (notificationMenu) {
                notificationMenu.classList.remove('show');
            }
        });
    }

    // Fermeture des menus lors du clic ailleurs
    document.addEventListener('click', function(e) {
        const target = e.target as HTMLElement;
        if (notificationMenu && profileMenu) {
            if (!target.closest('#notificationIcon') && !target.closest('#profileMenu')) {
                notificationMenu.classList.remove('show');
            }
            if (!target.closest('#profileIcon') && !target.closest('#profileMenu')) {
                profileMenu.classList.remove('show');
            }
        }
    });
}
}
