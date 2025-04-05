import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkApplicationsService } from '../../services/work-applications.service';
import { InternshipApplicationsService } from '../../services/internship-applications.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-interview-form',
  templateUrl: './interview-form.component.html',
  styleUrls: ['./interview-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class InterviewFormComponent {
  interviewForm: FormGroup;
  today: Date = new Date();
  isInternshipRoute: boolean = false;
  isLoading: boolean = false; // <-- Nouvelle propriété


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InterviewFormComponent>,
    private workApplicationsService: WorkApplicationsService,
    private internshipApplicationsService: InternshipApplicationsService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { applicationId: string },
  ) {
    this.dateAdapter.setLocale('fr-FR');
    this.interviewForm = this.fb.group({
      date: [null, Validators.required],
      time: ['', Validators.required],
    });

    // Vérifier la route actuelle
    this.isInternshipRoute = this.router.url.includes('offres-stage');
  }

  formatDateForDisplay(date: Date | null): string {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') || '' : '';
  }

  onDateSelected(event: any): void {
    if (event.value) {
      this.interviewForm.patchValue({
        date: event.value
      });
    }
  }

  onSubmit(): void {
    if (this.interviewForm.valid && !this.isLoading) { // <-- Vérifier isLoading
      this.isLoading = true; // <-- Désactiver le bouton
  
      const selectedDate = this.interviewForm.value.date;
      const formattedDate = this.datePipe.transform(selectedDate, 'dd/MM/yyyy');
      
      if (!formattedDate) {
        this.toastr.error('Date invalide', 'Erreur');
        this.isLoading = false;
        return;
      }
  
      const service = this.isInternshipRoute 
        ? this.internshipApplicationsService 
        : this.workApplicationsService;
  
      service.approveWithInterview(
          this.data.applicationId,
          formattedDate,
          this.interviewForm.value.time,
        )
        .subscribe({
          next: () => {
            const message = this.isInternshipRoute
              ? 'Demande de stage approuvée et date d\'entretien envoyée'
              : 'Demande approuvée et date d\'entretien envoyée';
            
            this.toastr.success(message, 'Succès');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error:', error);
            this.toastr.error(
              `Erreur lors de l'approbation${this.isInternshipRoute ? ' de la demande de stage' : ''}`,
              'Erreur'
            );
            this.isLoading = false; // <-- Réactiver en cas d'erreur
          },
          complete: () => {
            this.isLoading = false; // <-- S'assurer qu'il est toujours réactivé
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}