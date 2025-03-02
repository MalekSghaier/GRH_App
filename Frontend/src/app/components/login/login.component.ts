import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Importation de Toastr

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService // Injection de ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error('Email ou mot de passe incorrect', 'Erreur');
      return;
    }

    this.http.post('http://localhost:3000/auth/login', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          this.toastr.success(
            "Ravi de vous retrouver ! Gérez vos demandes et accédez à vos documents en toute sérénité.",
            "Bienvenue"
          );
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.toastr.error('Email ou mot de passe incorrect', 'Erreur');
        }
      });
  }
}
