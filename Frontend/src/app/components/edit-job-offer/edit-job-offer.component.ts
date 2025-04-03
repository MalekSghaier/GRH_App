import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { JobOffersService } from '../../services/job-offers.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-job-offer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './edit-job-offer.component.html',
  styleUrls: ['./edit-job-offer.component.css']
})
export class EditJobOfferComponent implements OnInit {
  formTitle = 'Modifier Offre d\'Emploi';
  
  jobOffer = {
    _id: '',
    title: '',
    description: '',
    company: '',
    location: '',
    experienceRequired: 0,
    educationLevel: '',
    jobRequirements: '',
    createdBy: null as any // Ajoutez cette ligne avec le type approprié

  };

  educationLevels = [
    'Bac',
    'Bac+2',
    'Bac+3',
    'Bac+5',
    'Doctorat'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { offer: any },
    private dialogRef: MatDialogRef<EditJobOfferComponent>,
    private jobOffersService: JobOffersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data?.offer) {
      this.jobOffer = { 
        ...this.data.offer,
        experienceRequired: typeof this.data.offer.experienceRequired === 'string' ? 
          parseInt(this.data.offer.experienceRequired.replace(' ans', '')) : 
          this.data.offer.experienceRequired
      };
    }
  }

  onSubmit(): void {
    // Préparer les données à envoyer en conservant le format original
    const updateData = {
      ...this.jobOffer,
    };
  
    // Supprimer createdBy si présent pour éviter la conversion en string
    delete updateData.createdBy;
  
    this.jobOffersService.updateJobOffer(this.jobOffer._id, updateData).subscribe({
      next: (updatedOffer) => {
        this.toastr.success('Offre modifiée avec succès!', 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
        // Retourner l'offre complète avec le createdBy original
        this.dialogRef.close({
          ...updatedOffer,
          createdBy: this.data.offer.createdBy // Conserve l'ObjectId original
        });
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la modification', 'Erreur', {
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