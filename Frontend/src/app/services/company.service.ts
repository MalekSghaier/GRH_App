import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
