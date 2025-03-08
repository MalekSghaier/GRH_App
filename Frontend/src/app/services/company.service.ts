import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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


  getCompanies(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Aucun token trouvé !");
      return new Observable();
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(companies => {
        return companies.map(company => ({
          ...company,
          logo: company.logo ? `http://localhost:3000/${company.logo}` : null,
          signature: company.signature ? `http://localhost:3000/${company.signature}` : null
        }));
      })
    );
  }
  

  deleteCompany(companyId: string) {
    return this.http.delete(`http://localhost:3000/companies/${companyId}`);
  }
  

  
}
