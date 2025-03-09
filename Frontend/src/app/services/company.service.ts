import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Company } from '../models/company.model'; // Importer l'interface Company


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3000/companies';

  constructor(private http: HttpClient) {}

  addCompany(formData: FormData): Observable<any> {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    // Vérifier si le token est disponible
    if (!token) {
      console.error("Aucun token trouvé !");
      return new Observable();
    }

    // Définir les headers avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Envoyer la requête POST
    return this.http.post(this.apiUrl, formData, { headers });
  }


  // Méthode pour récupérer les compagnies avec pagination
  getCompanies(page: number = 1, limit: number = 3): Observable<{ data: any[]; total: number }> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Ajouter les paramètres de pagination à la requête
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<{ data: any[]; total: number }>(this.apiUrl, { headers, params })
      .pipe(
        map((response) => {
          // Transformer les URLs des images (logo et signature)
          return {
            data: response.data.map((company) => ({
              ...company,
              logo: company.logo ? `http://localhost:3000/${company.logo}` : null,
              signature: company.signature ? `http://localhost:3000/${company.signature}` : null,
            })),
            total: response.total,
          };
        })
      );
  }

  

  deleteCompany(companyId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${companyId}`, { headers });
  }

  getCompanyById(id: string): Observable<Company> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Company>(`${this.apiUrl}/${id}`, { headers });
  }


  updateCompany(id: string, company: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, company, { headers });
  }
  

}
