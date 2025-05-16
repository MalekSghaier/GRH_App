import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-document-approval-form',
  templateUrl: './document-approval-form.component.html',
  styleUrls: ['./document-approval-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class DocumentApprovalFormComponent {
  approvalForm: FormGroup;
  selectedFile: File | null = null;
  isLoading: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentApprovalFormComponent>,
    private documentRequestsService: DocumentRequestsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { requestId: string, requestData: any }
  ) {
    this.approvalForm = this.fb.group({
      message: ['Votre document est prêt. Veuillez trouver ci-joint le fichier demandé.', Validators.required]
    });
  }

  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastr.error('Le fichier ne doit pas dépasser 5MB', 'Erreur');
        return;
      }
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.approvalForm.valid && this.selectedFile && !this.isLoading) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('document', this.selectedFile);
      formData.append('message', this.approvalForm.value.message);
      formData.append('requestId', this.data.requestId);

      this.documentRequestsService.approveAndSendDocument(formData).subscribe({
        next: () => {
          this.toastr.success('Document envoyé avec succès', 'Succès');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastr.error('Erreur lors de l\'envoi du document', 'Erreur');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

removeFile(event: Event): void {
  event.stopPropagation();
  this.selectedFile = null;
  this.fileInput.nativeElement.value = '';
}



  onCancel(): void {
    this.dialogRef.close(false);
  }


}