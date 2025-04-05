// src/app/services/internship-offers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InternshipOffer {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  duration: number;
  educationLevel: string;
  requirements: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InternshipOffersService {
  private apiUrl = 'http://localhost:3000/internship-offers';

  constructor(private http: HttpClient) {}

  createInternshipOffer(offerData: Omit<InternshipOffer, '_id' | 'createdAt' | 'updatedAt'>): Observable<InternshipOffer> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<InternshipOffer>(this.apiUrl, offerData, { headers });
  }

  getInternshipOffers(): Observable<InternshipOffer[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InternshipOffer[]>(this.apiUrl, { headers });
  }

  getMyInternshipOffers(): Observable<InternshipOffer[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InternshipOffer[]>(`${this.apiUrl}/my-offers`, { headers });
  }

  getInternshipOfferById(id: string): Observable<InternshipOffer> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InternshipOffer>(`${this.apiUrl}/${id}`, { headers });
  }

  updateInternshipOffer(id: string, offerData: Partial<InternshipOffer>): Observable<InternshipOffer> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<InternshipOffer>(`${this.apiUrl}/${id}`, offerData, { headers });
  }

  deleteInternshipOffer(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}