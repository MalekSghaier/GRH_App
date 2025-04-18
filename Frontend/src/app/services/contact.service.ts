// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `http://localhost:3000/contact`;

  constructor(private http: HttpClient) {}

  sendContactForm(formData: { name: string; email: string; message: string }) {
    return this.http.post(this.apiUrl, formData);
  }
}