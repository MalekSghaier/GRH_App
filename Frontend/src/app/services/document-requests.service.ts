// src/app/services/document-requests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentRequest } from '../models/document-request.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentRequestsService {
  private apiUrl = 'http://localhost:3000/document-requests'; // URL de votre API

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer le token JWT depuis le localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Récupérer le token JWT
    if (!token) {
      throw new Error('Token JWT non trouvé');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer toutes les demandes de documents
  findAllRequests(): Observable<DocumentRequest[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DocumentRequest[]>(this.apiUrl, { headers });
  }

  // Récupérer une demande de document par son ID
  findRequestById(id: string): Observable<DocumentRequest> {
    const headers = this.getAuthHeaders();
    return this.http.get<DocumentRequest>(`${this.apiUrl}/${id}`, { headers });
  }
  
  updateRequestStatus(id: string, status: string): Observable<DocumentRequest> {
    const headers = this.getAuthHeaders();
    return this.http.put<DocumentRequest>(`${this.apiUrl}/${id}/status`, { status }, { headers });
  }

  approveRequest(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.apiUrl}/${id}/approve`, 
      {}, 
      { headers }
    );
  }


}