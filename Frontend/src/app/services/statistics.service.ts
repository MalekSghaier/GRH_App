import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/companies'; 

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les statistiques
  getStatistics(): Observable<{ totalCompanies: number; totalEmployees: number; totalInterns: number }> {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    // Vérifier si le token est disponible
    if (!token) {
      console.error('Aucun token trouvé !');
      return new Observable();
    }

    // Définir les headers avec le token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Envoyer la requête GET
    return this.http.get<{ totalCompanies: number; totalEmployees: number; totalInterns: number }>(
      `${this.apiUrl}/statistics`,
      { headers }
    );
  }

getMonthlyEvolution(): Observable<{ 
  months: string[]; 
  companies: number[]; 
  employees: number[]; 
  interns: number[] 
}> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.get<{
    months: string[];
    companies: number[];
    employees: number[];
    interns: number[];
  }>(`${this.apiUrl}/monthly-evolution`, { headers });
}
}