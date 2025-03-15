import { Component,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router ,NavigationEnd,RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedSidebarComponent } from "../shared-sidebar/shared-sidebar.component";
import { SharedNavbarComponent } from "../shared-navbar/shared-navbar.component"; // Importez CommonModule
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SharedSidebarComponent, SharedNavbarComponent,RouterModule] // Ajoutez CommonModule ici
 // Ajoutez CommonModule ici
 // Ajoutez CommonModule ici
})
export class AddUserFormComponent implements AfterViewInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,

  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      company: ['', Validators.required] // Société d'accueil
    });
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

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Utilisateur créé avec succès', response);
          this.router.navigate(['/users']); // Rediriger vers la liste des utilisateurs
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      });
    }
  }
}