import { Component, AfterViewInit,ViewEncapsulation,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule ,NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr'; 
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { CompanyService } from '../../services/company.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-change-password-employ',
  imports: [CommonModule, RouterModule,ReactiveFormsModule,SharedSidebarComponent,SharedNavbarComponent],
  templateUrl: './change-password-employ.component.html',
  styleUrl: './change-password-employ.component.css'
})
export class ChangePasswordEmployComponent implements AfterViewInit, OnInit{

  currentRoute: string = '';
  changePasswordForm: FormGroup;
  showNewPasswordFields: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService, // Inject ToastrService
    private authService: AuthService
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: [''],
      confirmNewPassword: ['']
    });

    // Gestion de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout(); // Appelez la méthode logout
  }

  // Vérifier l'ancien mot de passe
  checkOldPassword(): void {
    const oldPassword = this.changePasswordForm.get('oldPassword')?.value;

    this.userService.checkPassword(oldPassword).subscribe(
      (isValid) => {
        if (isValid) {
          this.showNewPasswordFields = true; // Afficher les champs du nouveau mot de passe
          this.changePasswordForm.get('newPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.changePasswordForm.get('confirmNewPassword')?.setValidators([Validators.required]);
          this.changePasswordForm.get('newPassword')?.updateValueAndValidity();
          this.changePasswordForm.get('confirmNewPassword')?.updateValueAndValidity();
        } else {
          this.toastr.error('Ancien mot de passe incorrect', 'Erreur', {
            timeOut: 1500,
            progressBar: true
          }); // Toast pour erreur
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du mot de passe', error);
        this.toastr.error('Une erreur est survenue lors de la vérification du mot de passe', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        }); // Toast pour erreur
      }
    );
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmNewPassword = this.changePasswordForm.get('confirmNewPassword')?.value;

      if (newPassword === confirmNewPassword) {
        this.userService.changePassword(newPassword).subscribe(
          (data) => {
            this.toastr.success('Mot de passe mis à jour avec succès !', 'Succès', {
              timeOut: 1500,
              progressBar: true
            }); // Toast pour succès
            this.router.navigate(['/profil']);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du mot de passe', error);
            this.toastr.error('Une erreur est survenue lors de la mise à jour du mot de passe', 'Erreur', {
              timeOut: 1500,
              progressBar: true
            }); // Toast pour erreur
          }
        );
      } else {
        this.toastr.warning('Les nouveaux mots de passe ne correspondent pas', 'Attention', {
          timeOut: 1500,
          progressBar: true
        }); // Toast pour avertissement
      }
    } else {
      this.toastr.warning('Veuillez remplir tous les champs correctement', 'Attention', {
        timeOut: 1500,
        progressBar: true
      }); // Toast pour avertissement
    }
  }

  // Annuler et revenir à la page de profil
  cancel(): void {
    this.router.navigate(['/profil']);
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
