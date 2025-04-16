// src/app/services/internship-applications.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipApplicationsService {
  private apiUrl = 'http://localhost:3000/internship-applications';

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
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(
      `${this.apiUrl}/search/${encodeURIComponent(companyName)}?query=${encodeURIComponent(query)}`, 
      { headers }
    );
  }


// Dans internship-applications.service.ts
createApplication(applicationData: any): Observable<any> {
  const formData = new FormData();
  
  // Conversion de la date en format ISO
  const birthDate = new Date(applicationData.birthDate);
  
  // Ajout des champs avec vérification
  formData.append('fullName', applicationData.fullName);
  formData.append('email', applicationData.email.trim()); // Nettoyage de l'email
  formData.append('birthDate', birthDate.toISOString());
  formData.append('phone', applicationData.phone);
  formData.append('company', applicationData.company);
  formData.append('position', applicationData.position);
  
  // Fichiers
  if (applicationData.cv) {
    formData.append('cv', applicationData.cv, applicationData.cv.name);
  }
  if (applicationData.coverLetter) {
    formData.append('coverLetter', applicationData.coverLetter, applicationData.coverLetter.name);
  }

  return this.http.post(this.apiUrl, formData, {
    headers: {
      // Pas besoin de Content-Type, FormData le gère automatiquement
    },
    reportProgress: true // Optionnel: pour suivre la progression de l'upload
  });
}
}