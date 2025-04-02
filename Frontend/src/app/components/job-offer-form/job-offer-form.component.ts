import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { JobOffersService } from '../../services/job-offers.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-offer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './job-offer-form.component.html',
  styleUrls: ['./job-offer-form.component.css']
})
export class JobOfferFormComponent {
  jobOffer = {
    title: '',
    description: '',
    company: '',
    location: '',
    experienceRequired: 0,
    educationLevel: '',
    jobRequirements: ''
  };

  educationLevels = [
    'Bac',
    'Bac+2',
    'Bac+3',
    'Bac+5',
    'Doctorat'
  ];

  constructor(
    private dialogRef: MatDialogRef<JobOfferFormComponent>,
    private jobOffersService: JobOffersService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.jobOffersService.createJobOffer(this.jobOffer).subscribe({
      next: () => {
        this.snackBar.open('Offre créée avec succès!', 'Fermer', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Erreur lors de la création', 'Fermer', {
          duration: 3000
        });
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}