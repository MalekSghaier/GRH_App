import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';

@Component({
  selector: 'app-update-user',
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit, AfterViewInit {
  userForm: FormGroup; // Formulaire réactif
  userId: string = ''; // ID de l'utilisateur à modifier

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire réactif
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      company: ['']
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis l'URL
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.loadUserData(); // Charger les données de l'utilisateur
    } else {
      this.toastr.error('ID utilisateur non trouvé', 'Erreur', {
        timeOut: 1500,
        progressBar: true
      });
      this.router.navigate(['/users']); // Rediriger si l'ID est manquant
    }
  }

  // Charger les données de l'utilisateur
  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        // Mettre à jour le formulaire avec les données de l'utilisateur
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données de l\'utilisateur:', err);
        this.toastr.error('Erreur lors du chargement des données de l\'utilisateur', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
        this.router.navigate(['/users']); // Rediriger en cas d'erreur
      }
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userId, this.userForm.value).subscribe({
        next: () => {
          this.toastr.success('Utilisateur mis à jour avec succès', 'Succès', {
            timeOut: 1500,
            progressBar: true
          });
          this.router.navigate(['/users']); // Rediriger vers la liste des utilisateurs
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
          this.toastr.error('Erreur lors de la mise à jour de l\'utilisateur', 'Erreur', {
            timeOut: 1500,
            progressBar: true
          });
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires', 'Avertissement', {
        timeOut: 1500,
        progressBar: true
      });
    }
  }

  // Initialiser la barre latérale
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