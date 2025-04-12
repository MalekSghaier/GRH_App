import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h2>Postuler à l'offre {{ offerId }}</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="fullName">Nom complet</label>
          <input type="text" id="fullName" [(ngModel)]="application.fullName" name="fullName" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" [(ngModel)]="application.email" name="email" required>
        </div>
        
        <div class="form-group">
          <label for="message">Lettre de motivation</label>
          <textarea id="message" [(ngModel)]="application.message" name="message" required></textarea>
        </div>
        
        <button type="submit" class="btn-submit">Envoyer ma candidature</button>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-submit {
      background: #6c63ff;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ApplicationFormComponent {
  offerId: string;
  application = {
    fullName: '',
    email: '',
    message: ''
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    this.offerId = this.route.snapshot.paramMap.get('id') || '';
  }

  onSubmit() {
    // Ici vous ajouterez la logique d'envoi au backend
    console.log('Candidature envoyée:', this.application);
    alert('Votre candidature a été soumise avec succès!');
    this.router.navigate(['/landing-page']);
  }
}