// src/app/services/internship-offers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
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

  countMyInternshipOffers(): Observable<number> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${this.apiUrl}/my-offers/count`, { headers });
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

  searchInternshipOffers(query: string): Observable<InternshipOffer[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<InternshipOffer[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`, { headers });
  }

  getOfferDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Ajouter ces méthodes dans internship-offers.service.ts

  searchPublicOffers(
    query: string,
    duration?: number,
    educationLevel?: string,
    requirements?: string
  ): Observable<InternshipOffer[]> {
    console.log('Sending search with params:', {
      query: query,
      duration: duration,
      educationLevel: educationLevel,
      requirements: requirements
    });
  
    let params = new HttpParams().set('query', query || '');
    
    if (duration) params = params.append('duration', duration.toString());
    if (educationLevel) params = params.append('educationLevel', educationLevel);
    if (requirements) params = params.append('requirements', requirements);
    
    return this.http.get<InternshipOffer[]>(
      `${this.apiUrl}/public/search`,
      { params }
    );
  }

getAllPublicOffers(): Observable<InternshipOffer[]> {
  return this.http.get<InternshipOffer[]>(`${this.apiUrl}/public/all`);
}
}