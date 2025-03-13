//auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router,NavigationStart  } from '@angular/router';
import { Location } from '@angular/common'; // Importez Location


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient,
     private router: Router,
     private location: Location
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!localStorage.getItem('token')) {
          this.location.forward(); // Empêche le retour en arrière
        }
      }
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  loginCompany(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/company`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token'); // Supprimez le token
    this.router.navigate(['/login']); // Redirigez vers la page de connexion
  }


  
}

