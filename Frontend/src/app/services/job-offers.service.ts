import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface JobOffer {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  experienceRequired: number;
  educationLevel: string;
  jobRequirements: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class JobOffersService {
  private apiUrl = 'http://localhost:3000/job-offers'; // Remplacez par l'URL de votre API


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

  getJobOffers(): Observable<JobOffer[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<JobOffer[]>(this.apiUrl, { headers });
  }

  getJobOfferById(id: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/${id}`);
  }

  updateJobOffer(id: string, offerData: Partial<JobOffer>): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.apiUrl}/${id}`, offerData);
  }

  deleteJobOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}