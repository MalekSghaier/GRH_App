// src/app/services/conges.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaginatedCongesResponse {
  data: any[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CongesService {
  private apiUrl = 'http://localhost:3000/conges';

  constructor(private http: HttpClient) {}

  // Récupérer tous les congés
  getAllConges(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getAllPendingConges(): Observable<any[]> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/pending`, { headers });
  }

  getCompanyCongesPaginated(page: number = 1, limit: number = 5): Observable<PaginatedCongesResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PaginatedCongesResponse>(
      `${this.apiUrl}/company/paginated?page=${page}&limit=${limit}`,
      { headers }
    );
  }

  getPendingCongesCountForCompany(): Observable<{ count: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/company/pending/count`, 
      { headers }
    );
  }

  getPendingCongesCount(): Observable<{ count: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ count: number }>(`${this.apiUrl}/pending/count`, { headers });
  }

  // Mettre à jour le statut d'un congé (accepter ou rejeter)
  updateCongeStatus(id: string, status: 'approved' | 'rejected'): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, { status }, { headers });
  }

}