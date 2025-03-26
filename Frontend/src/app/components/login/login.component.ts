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
}