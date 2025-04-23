//auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router,NavigationStart  } from '@angular/router';
import { Location } from '@angular/common'; 
import { jwtDecode } from 'jwt-decode'; // Installer avec: npm install jwt-decode



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

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

    const token = localStorage.getItem('token');
    if (token) {
      this.setUserFromToken(token);
    }
  }

  //login(email: string, password: string): Observable<any> {
   // return this.http.post(`${this.apiUrl}/login`, { email, password });
  //}

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.access_token) {
          this.setUserFromToken(response.access_token);
          localStorage.setItem('token', response.access_token);
        }
      })
    );
  }

  private setUserFromToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        companyName: decoded.companyName
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Error decoding token', e);
      this.logout();
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  loginCompany(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/company`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token'); // Supprimez le token
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/landing-page']); // Redirigez vers la landing page
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  
}

