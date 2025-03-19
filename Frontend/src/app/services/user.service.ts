import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  getMyInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/my-info`, { headers });
  }

    // Récupérer la liste des utilisateurs pour l'admin
    getAdminUsers(): Observable<any[]> {
      const token = localStorage.getItem('token'); // Récupérer le token JWT
      if (!token) {
        throw new Error('Aucun token trouvé !');
      }
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Ajouter le token dans les en-têtes
      return this.http.get<any[]>(`${this.apiUrl}/admin-users`, { headers });
    }
  

  updateProfile(profileData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/my-info`, profileData, { headers });
  }

  checkPassword(oldPassword: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<boolean>(`${this.apiUrl}/check-password`, { oldPassword }, { headers });
  }

  changePassword(newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/change-password`, { newPassword }, { headers });
  }

  createUser(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}`, userData, { headers });
  }

  // Générer un QR Code pour un utilisateur
  generateQrCode(userId: string): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(`${this.apiUrl}/${userId}/generate-qrcode`, {}, { headers });
  }

  getUserById(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers });
  }
  
  updateUser(userId: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${userId}`, userData, { headers });
  }
  
  deleteUser(userId: string): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers });
  }

  getPaginatedAdminUsers(page: number, limit: number): Observable<{ data: any[]; total: number }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ data: any[]; total: number }>(`${this.apiUrl}/admin-users/paginated?page=${page}&limit=${limit}`, { headers });
  }

  searchUsers(query: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`, { headers });
  }
}