// application-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InternshipApplicationsService } from '../../services/internship-applications.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';



// Définir le format de date personnalisé
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};
@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    
  ],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class ApplicationFormComponent {
  applicationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplicationFormComponent>,
    private applicationsService: InternshipApplicationsService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.applicationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
      company: [data.offer.company, [Validators.required]],
      position: [data.offer.title, [Validators.required]],
      cv: ['', [Validators.required]],
      coverLetter: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.applicationForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const formData = this.applicationForm.value;
    formData.birthDate = new Date(formData.birthDate).toISOString();

    this.applicationsService.createApplication(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Votre candidature a été soumise avec succès!', 'Fermer', {
          duration: 5000
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Une erreur est survenue. Veuillez réessayer.', 'Fermer', {
          duration: 5000
        });
        console.error('Error submitting application:', error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.applicationForm.patchValue({
        [field]: file
      });
    }
  }
}