// src/app/components/internship-offer-form/internship-offer-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { InternshipOffersService } from '../../services/internship-offers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-internship-offer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './internship-offer-form.component.html',
  styleUrls: ['./internship-offer-form.component.css']
})
export class InternshipOfferFormComponent {
  internshipOffer = {
    title: '',
    description: '',
    company: '',
    location: '',
    duration: 1,
    educationLevel: '',
    requirements: ''
  };

  educationLevels = [
    'Bac',
    'Bac+2',
    'Bac+3',
    'Bac+5',
    'Doctorat'
  ];

  constructor(
    private dialogRef: MatDialogRef<InternshipOfferFormComponent>,
    private internshipOffersService: InternshipOffersService,
    private toastr: ToastrService
  ) {
    this.loadCompanyName();
  }

  private loadCompanyName(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.internshipOffer.company = payload.companyName || '';
      } catch (e) {
        console.error('Erreur lors du décodage du token', e);
      }
    }
  }

  onSubmit(): void {
    this.internshipOffersService.createInternshipOffer(this.internshipOffer).subscribe({
      next: () => {
        this.toastr.success('Offre de stage créée avec succès!', 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la création', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}