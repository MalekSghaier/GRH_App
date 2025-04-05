// src/app/components/edit-internship-offer/edit-internship-offer.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { InternshipOffersService } from '../../services/internship-offers.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-internship-offer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './edit-internship-offer.component.html',
  styleUrls: ['./edit-internship-offer.component.css']
})
export class EditInternshipOfferComponent implements OnInit {
  formTitle = 'Modifier Offre de Stage';
  
  internshipOffer = {
    _id: '',
    title: '',
    description: '',
    company: '',
    location: '',
    duration: 1,
    educationLevel: '',
    requirements: '',
    createdBy: null as any
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
    private dialogRef: MatDialogRef<EditInternshipOfferComponent>,
    private internshipOffersService: InternshipOffersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data?.offer) {
      this.internshipOffer = { 
        ...this.data.offer,
        duration: typeof this.data.offer.duration === 'string' ? 
          parseInt(this.data.offer.duration.replace(' mois', '')) : 
          this.data.offer.duration
      };
    }
  }

  onSubmit(): void {
    // Préparer les données à envoyer
    const updateData = {
      ...this.internshipOffer,
    };
  
    // Supprimer createdBy si présent pour éviter la conversion en string
    delete updateData.createdBy;
  
    this.internshipOffersService.updateInternshipOffer(this.internshipOffer._id, updateData).subscribe({
      next: (updatedOffer) => {
        this.toastr.success('Offre de stage modifiée avec succès!', 'Succès', {
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