import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface JobOffer {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  experienceRequired: number | string; // Modifié pour accepter soit number soit string
  educationLevel: string;
  jobRequirements: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class JobOffersService {
  private apiUrl = 'http://localhost:3000/job-offers';


  constructor(private http: HttpClient) {}

  createJobOffer(offerData: Omit<JobOffer, '_id' | 'createdAt' | 'updatedAt'>): Observable<JobOffer> {
    const token = localStorage.getItem('token');

        // Vérifier si le token est disponible
    if (!token) {
        console.error("Aucun token trouvé !");
        return new Observable();
      }

      // Définir les headers avec le token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<JobOffer>(this.apiUrl, offerData, { headers });
  }

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getJobOffers(): Observable<JobOffer[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<JobOffer[]>(this.apiUrl, { headers });
  }

  getMyJobOffers(): Observable<JobOffer[]> {
     const token = localStorage.getItem('token');
     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<JobOffer[]>(`${this.apiUrl}/my-offers`, { headers });
  }

  countMyJobOffers(): Observable<number> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${this.apiUrl}/my-offers/count`, { headers });
  }

  getJobOfferById(id: string): Observable<JobOffer> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`, { headers });
  }

  updateJobOffer(id: string, offerData: Partial<JobOffer>): Observable<JobOffer> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, offerData, { headers });
  }

  deleteJobOffer(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  searchJobOffers(query: string): Observable<JobOffer[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Aucun token trouvé !');
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<JobOffer[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`, { headers });
  }

    searchPublicOffers(
      query: string,
      duration?: number,
      educationLevel?: string,
      requirements?: string
    ): Observable<JobOffer[]> {
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
      
      return this.http.get<JobOffer[]>(
        `${this.apiUrl}/public/search`,
        { params }
      );
    }
}