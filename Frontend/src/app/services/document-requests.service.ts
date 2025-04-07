// src/app/services/document-requests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentRequest } from '../models/document-request.model';


interface PaginatedDocumentRequests {
  data: DocumentRequest[];
  total: number;
}
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

  getCompanyDocumentRequestsPaginated(page: number = 1, limit: number = 5): Observable<PaginatedDocumentRequests> {
    const headers = this.getAuthHeaders();
    return this.http.get<PaginatedDocumentRequests>(
      `${this.apiUrl}/company/paginated?page=${page}&limit=${limit}`,
      { headers }
    );
  }

  getPendingDocsCountForCompany(): Observable<{ count: number }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/company/pending/count`,
      { headers }
    );
  }

  approveRequest(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.apiUrl}/${id}/approve`, 
      {}, 
      { headers }
    );
  }

  getPendingDocsCount(): Observable<{ count: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ count: number }>(`${this.apiUrl}/pending/count`, { headers });
  }

  getDocumentStats(): Observable<{ pending: number; approved: number; rejected: number }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ pending: number; approved: number; rejected: number }>(
      `${this.apiUrl}/company/stats`,
      { headers }
    );
  }

}