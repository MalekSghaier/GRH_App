import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkApplicationsService {
  private apiUrl = 'http://localhost:3000/work-applications';

  constructor(private http: HttpClient) {}

  getApplicationsByCompany(companyName: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/company/${companyName}?status=En cours de traitement`, { headers });
  }

  getPendingApplicationsCount(companyName: string): Observable<{count: number}> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{count: number}>(`${this.apiUrl}/count/${companyName}`, { headers });
  }

  updateStatus(id: string, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, { status }, { headers });
  }
}