// pointage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointageService {

  private apiUrl = 'http://localhost:3000/pointage';

  constructor(private http: HttpClient) {}

enregistrerPointage(userId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/scan-qr`, { userId });
}


  getPointagesUtilisateur(userId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  getMonthlyPointages(userId: string, month: number, year: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(
      `${this.apiUrl}/monthly?month=${month}&year=${year}`, { headers }
    );
  }

  enregistrerPointageFace(userId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/scan-face`, { userId });
}

  getPresenceAujourdhui(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.apiUrl}/today`, { headers });
}

getPointagesByDate(date: string): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.apiUrl}/by-date?date=${date}`, { headers });
}

}