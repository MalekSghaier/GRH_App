// src/app/services/conges.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CongesRequest } from '../models/conges-request.model';

interface PaginatedCongesResponse {

  data: CongesRequest[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CongesService {
  private apiUrl = 'http://localhost:3000/conges';

  constructor(private http: HttpClient) {}
  create(requestData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);    
    return this.http.post(`${this.apiUrl}`, requestData, { headers });
  }

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

  // src/app/services/conges.service.ts

getMonthlyCongesStats(): Observable<{month: string, count: number}[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<{month: string, count: number}[]>(
    `${this.apiUrl}/company/monthly-stats`, 
    { headers }
  );
}

  findRequestsByUser(): Observable<CongesRequest[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CongesRequest[]>(`${this.apiUrl}/my-conges`, { headers });
  }



delete(id: string): Observable<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Aucun token trouvé !');
    return new Observable();
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
}

}