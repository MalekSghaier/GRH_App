import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { JobOffersService } from '../../services/job-offers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-job-offer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './job-offer-form.component.html',
  styleUrls: ['./job-offer-form.component.css']
})
export class JobOfferFormComponent implements OnInit {
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
    'Licence',
    'Master',
    'Ingénieur',
    'Doctorat',
  ];

  constructor(
    private dialogRef: MatDialogRef<JobOfferFormComponent>,
    private jobOffersService: JobOffersService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.loadCompanyName();
  }


  private loadCompanyName(): void {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Décodage du token JWT pour obtenir les informations
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.jobOffer.company = payload.companyName || '';
      } catch (e) {
        console.error('Erreur lors du décodage du token', e);
      }
    }
  }

  onSubmit(): void {
    this.jobOffersService.createJobOffer(this.jobOffer).subscribe({
      next: () => {
        this.toastr.success('Offre créée avec succès!', 'Succès', {
          timeOut: 1500,
          progressBar: true
          });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastr.success('Erreur lors de la création', 'Fermer', {
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