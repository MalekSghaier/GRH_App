import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkApplicationsService {
  private apiUrl = 'http://localhost:3000/work-applications';

  constructor(private http: HttpClient) {}

  createWorkApplication(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData).pipe(
      catchError(error => {
        if (error.error?.message === 'Vous avez déjà postulé à cette offre d\'emploi') {
          return throwError(() => new Error('Vous avez déjà postulé à cette offre d\'emploi'));
        }
        return throwError(() => error);
      })
    );
  }

  checkExistingApplication(email: string, company: string, position: string): Observable<{hasApplied: boolean}> {
    return this.http.get<{hasApplied: boolean}>(`${this.apiUrl}/check-application`, {
      params: { email, company, position }
    });
  }

  
  getApplicationsByCompany(companyName: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/company/${companyName}`, { headers });
  }

  getPendingApplicationsCount(companyName: string): Observable<{count: number}> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{count: number}>(`${this.apiUrl}/count/${companyName}`, { headers });
  }
  updateStatus(applicationId: string, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${applicationId}`, { status }, { headers });
  }

  approveWithInterview(id: string, date: string, time: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}/approve`, { date, time }, { headers });
  }

  searchApplications(query: string, companyName: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(
      `${this.apiUrl}/search/${companyName}?query=${encodeURIComponent(query)}`, 
      { headers }
    );
  }
}