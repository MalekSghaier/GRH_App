import { Component, Inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkApplicationsService } from '../../services/work-applications.service';


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
  selector: 'app-application-work-form',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './application-work-form.component.html',
  styleUrls: ['./application-work-form.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class ApplicationWorkFormComponent implements OnInit {
  applicationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApplicationWorkFormComponent>,
    private workApplicationsService: WorkApplicationsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.applicationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
      availability: ['', [Validators.required]],
      company: [data.offer.company, [Validators.required]],
      position: [data.offer.title, [Validators.required]],
      cv: ['', [Validators.required]],
      coverLetter: ['', [Validators.required]]
    });
  }


  ngOnInit() {
    // Vérifier si l'utilisateur a déjà postulé quand l'email change
    this.applicationForm.get('email')?.valueChanges.subscribe(email => {
      if (email && this.applicationForm.get('email')?.valid) {
        this.checkExistingApplication();
      }
    });
  }


  checkExistingApplication() {
    const email = this.applicationForm.get('email')?.value;
    const company = this.applicationForm.get('company')?.value;
    const position = this.applicationForm.get('position')?.value;

    if (email && company && position) {
      this.workApplicationsService.checkExistingApplication(email, company, position)
        .subscribe({
          next: (response) => {
            if (response.hasApplied) {
              this.toastr.warning('Vous avez déjà postulé à cette offre', 'Attention', {
                timeOut: 1500,
                progressBar: true
              });
              this.applicationForm.disable();
              this.onCancel();
            }
          },
          error: (error) => {
            console.error('Erreur lors de la vérification:', error);
          }
        });
    }
  }
  onSubmit() {
    if (this.applicationForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    
    const formData = new FormData();
    formData.append('fullName', this.applicationForm.get('fullName')?.value);
    formData.append('email', this.applicationForm.get('email')?.value);
    formData.append('birthDate', new Date(this.applicationForm.get('birthDate')?.value).toISOString());
    formData.append('phone', this.applicationForm.get('phone')?.value);
    formData.append('availability', this.applicationForm.get('availability')?.value);
    formData.append('company', this.applicationForm.get('company')?.value);
    formData.append('position', this.applicationForm.get('position')?.value);
    
    // Ajout des fichiers
    const cvFile = this.applicationForm.get('cv')?.value;
    const coverLetterFile = this.applicationForm.get('coverLetter')?.value;
    
    if (cvFile) {
      formData.append('cv', cvFile, cvFile.name);
    }
    
    if (coverLetterFile) {
      formData.append('coverLetter', coverLetterFile, coverLetterFile.name);
    }
  
    this.workApplicationsService.createWorkApplication(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Votre candidature a été soumise avec succès!', 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.message === 'Vous avez déjà postulé à cette offre d\'emploi') {
          this.toastr.warning('Vous avez déjà postulé à cette offre d\'emploi', 'Erreur', {
            timeOut: 1500,
            progressBar: true
          });
          this.dialogRef.close(true);

        }else {
          this.toastr.error(
            error.error?.message || 'Une erreur est survenue. Veuillez réessayer.', 
            'Erreur'
          );
        }
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
      this.applicationForm.get(field)?.updateValueAndValidity();
    }
  }
}