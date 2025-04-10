import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CongesService } from '../../services/conges.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

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
  selector: 'app-conges-request-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './conges-request-form.component.html',
  styleUrl: './conges-request-form.component.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class CongesRequestFormComponent {
  congeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CongesRequestFormComponent>,
    private congesService: CongesService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.congeForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.congeForm.valid) {
      // Convertir les dates au format attendu par l'API si nécessaire
      const formValue = {
        ...this.congeForm.value,
        startDate: moment(this.congeForm.value.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.congeForm.value.endDate).format('YYYY-MM-DD')
      };
      
      this.congesService.create(formValue).subscribe({
        next: () => {
          this.toastr.success('Demande de congé créée avec succès', 'Succès');
          this.dialogRef.close(true);
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