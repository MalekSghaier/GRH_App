import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-login-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-company.component.html',
  styleUrl: './login-company.component.css'
})
export class LoginCompanyComponent {
  loginCampagnyForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = ''; 

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService 
  ) {
    this.loginCampagnyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  loginCompany() {
    if (this.loginCampagnyForm.invalid) {
      this.errorMessage = 'Email ou mot de passe incorrect';
      this.successMessage = '';
      this.toastr.error('Email ou mot de passe incorrect', 'Erreur');
      return;
    }
    this.http.post('http://localhost:3000/auth/login/company', this.loginCampagnyForm.value)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          this.successMessage = "Ravi de vous retrouver ! Gérez vos demandes et accédez à vos documents en toute sérénité.";
          this.errorMessage = ''; 
          this.toastr.success(this.successMessage, "Bienvenue");
  
          // Attendre 1,5 seconde avant de rediriger vers le dashboard
          setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.successMessage = '';
          this.toastr.error(this.errorMessage, 'Erreur');
        }
      });
  }

}
