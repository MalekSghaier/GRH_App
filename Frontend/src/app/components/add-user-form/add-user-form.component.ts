import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedSidebarComponent } from "../shared-sidebar/shared-sidebar.component";
import { SharedNavbarComponent } from "../shared-navbar/shared-navbar.component";
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SharedSidebarComponent, SharedNavbarComponent, RouterModule]
})
export class AddUserFormComponent implements AfterViewInit {
  userForm: FormGroup;
  isEmployeeOrIntern: boolean = false; // Variable pour gérer la visibilité du champ "company"
  companyName: string = ''; // Variable pour stocker le nom de la compagnie

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService

  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      company: ['',Validators.required], 
    });
  }

  ngOnInit(): void {
    // Récupérer le nom de la compagnie depuis le localStorage
    this.companyName = localStorage.getItem('companyName') || '';
    // Initialiser le champ "company" avec le nom de la compagnie
    this.userForm.patchValue({
      company: this.companyName,
    });
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
  }

  // Méthode pour gérer le changement de rôle
  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value;
    this.isEmployeeOrIntern = role === 'employé' || role === 'stagiaire';

    // Ajouter ou supprimer les validateurs pour le champ "company"
    if (this.isEmployeeOrIntern) {
      this.userForm.get('company')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('company')?.clearValidators();
    }
    this.userForm.get('company')?.updateValueAndValidity();
  }

  // Méthode pour initialiser la sidebar (inchangée)
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

  // Méthode pour ajuster la sidebar (inchangée)
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
      console.log('Données envoyées au backend :', userData);
  
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Utilisateur créé avec succès', response);
          this.toastr.success('Utilisateur créé avec succès', 'Succès'); // Message de succès
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 1500); // Redirection après 1,5 seconde
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
          if (error.status === 409) {
            this.toastr.error('Cet email est déjà utilisé.', 'Erreur'); // Message d'erreur spécifique
          } else {
            this.toastr.error('Une erreur s’est produite lors de la création de l’utilisateur.', 'Erreur'); // Message d'erreur générique
          }
        }
      });
    } else {
      this.toastr.error('Veuillez remplir tous les champs requis.', 'Erreur'); // Message d'erreur si le formulaire est invalide
    }
  }
}