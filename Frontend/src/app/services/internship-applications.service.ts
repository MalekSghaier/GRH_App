// src/app/services/internship-applications.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipApplicationsService {
  private apiUrl = 'http://localhost:3000/internship-applications';

  constructor(private http: HttpClient) {}

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

  updateStatus(id: string, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, { status }, { headers });
  }

  approveWithInterview(id: string, date: string, time: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}/approve`, { date, time }, { headers });
  }

  getPendingInternshipCount(companyName: string): Observable<{count: number}> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{count: number}>(`${this.apiUrl}/count/${companyName}`, { headers });
  }

  searchApplications(query: string, companyName: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(
      `${this.apiUrl}/search/${companyName}?query=${encodeURIComponent(query)}`, 
      { headers }
    );
  }

  createApplication(applicationData: any): Observable<any> {
    const formData = new FormData();
    
    Object.keys(applicationData).forEach(key => {
      if (key === 'cv' || key === 'coverLetter') {
        formData.append(key, applicationData[key]);
      } else {
        formData.append(key, applicationData[key]);
      }
    });

    return this.http.post(this.apiUrl, formData).pipe(
      catchError(error => {
        if (error.error?.message === 'Vous avez déjà postulé à cette offre de stage') {
          return throwError(() => new Error('Vous avez déjà postulé à cette offre de stage'));
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


}