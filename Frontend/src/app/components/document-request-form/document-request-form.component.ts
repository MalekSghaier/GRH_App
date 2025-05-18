// document-request-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './document-request-form.component.html',
  styleUrls: ['./document-request-form.component.css']
})
export class DocumentRequestFormComponent {
  requestForm: FormGroup;
  documentTypes = [
    'Contrat de travail',
    'Attestation de travail',
    'Bulletins de paie',
    'Solde de tout compte',
    'Attestation de présence',
    'Demande d\'avance sur salaire',
    'Lettre de recommandation',
    'Duplicata de documents perdus'
  ];
  
  contractTypes = ['CDI', 'CDD'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentRequestFormComponent>,
    private documentRequestService: DocumentRequestsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.requestForm = this.fb.group({
      fullName: ['', Validators.required],
      jobPosition: ['', Validators.required],
      contractType: ['', Validators.required],
      professionalEmail: ['', [Validators.required, Validators.email]],
      documentType: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.documentRequestService.createRequest(this.requestForm.value).subscribe({
        next: () => {
          this.toastr.success('Demande créée avec succès', 'Succès');
          this.dialogRef.close(true);
          window.location.reload();

        },
        error: (err) => {
          this.toastr.error('Erreur lors de la création de la demande', 'Erreur');
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}