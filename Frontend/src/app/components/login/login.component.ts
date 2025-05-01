import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Email ou mot de passe incorrect';
      this.successMessage = '';
      this.toastr.error('Email ou mot de passe incorrect', 'Erreur', {
        timeOut: 1500,
        progressBar: true
      });
      return;
    }

    this.http.post('http://localhost:3000/auth/login', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          const token = response.access_token;
          localStorage.setItem('token', token);
          
          const decodedToken: any = jwtDecode(token); 
          const role = decodedToken.role;

          // Affichage du message de succès
          this.successMessage = "Ravi de vous retrouver ! Gérez vos demandes et accédez à vos documents en toute sérénité.";
          this.errorMessage = ''; 
          this.toastr.success(this.successMessage, "Bienvenue", {
            timeOut: 1500,
            progressBar: true
          });

          // Rediriger l'utilisateur en fonction de son rôle
          if (role === 'superAdmin') {
            setTimeout(() => {
            this.router.navigate(['/superadmin-dashboard']);
          }, 1500);
          } else if (role === 'admin') {
            setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 1500);
          } else if (role === 'employé') {
            setTimeout(() => {
            this.router.navigate(['/employee-dashboard']);
          }, 1500);
          } else if (role === 'stagiaire') {
            setTimeout(() => {
            this.router.navigate(['/intern-dashboard']);
          }, 1500);

          } 
        },
        error: () => {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.successMessage = '';
          this.toastr.error(this.errorMessage, 'Erreur', {
            timeOut: 1500,
            progressBar: true
          });
        }
      });
  }

  // pointageRF() {
  //   this.http.get('http://localhost:3000/python/launch', { responseType: 'text' })
  //     .subscribe({
  //       next: (response: string) => {
  //         console.log('Script lancé avec succès :', response);
  //         this.toastr.success(response, 'Résultat de la détection', {
  //           timeOut: 3000,
  //           progressBar: true
  //         });
  //         alert('Résultat du script Python : ' + response);
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du lancement du script :', err);
  //         this.toastr.error('Erreur lors du lancement du script.', 'Erreur', {
  //           timeOut: 1500,
  //           progressBar: true
  //         });
  //       }
  //     });
  // }

  pointageRF() {
    this.toastr.info('Lancement de la reconnaissance faciale...', 'Veuillez patienter', {
      timeOut: 3000,
      progressBar: true
    });
  
    this.http.get<any>('http://localhost:3000/python/launch')
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.toastr.success(response.message, 'Reconnaissance réussie', {
              timeOut: 5000,
              progressBar: true
            });
          } else if (response.status === 'info') {
            this.toastr.info(response.message, 'Information', {
              timeOut: 5000,
              progressBar: true
            });
          } else {
            this.toastr.warning(response.message || 'Réponse inattendue', 'Attention', {
              timeOut: 5000,
              progressBar: true
            });
          }
        },
        error: (err) => {
          console.error('Erreur HTTP:', err);
          this.toastr.error(
            err.error?.message || err.message || 'Erreur de communication avec le serveur',
            'Erreur',
            { timeOut: 5000, progressBar: true }
          );
        }
      });
  }
  
  



  
}