import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login-compagny.component.html',
  styleUrl: './login-compagny.component.css'  
})
export class LoginCompanyComponent {
  loginCampagnyForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient
  ) {
    this.loginCampagnyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  loginCompany() {
    this.http.post('http://localhost:3000/auth/login/company', this.loginCampagnyForm.value)
      .subscribe({
        next: (response: any) => {
          console.log('Réponse du backend :', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erreur backend:', err);
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      });
  }
}
