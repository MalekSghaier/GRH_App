import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Ajouter l'importation de tap

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // api.service.ts
    getData(): Observable<any> {
     return this.http.get(`${this.apiUrl}/data`).pipe(
      tap(response => {
      console.log('Réponse de l\'API:', response); // Ajouter un log pour vérifier la réponse
    })
  );
}

}
