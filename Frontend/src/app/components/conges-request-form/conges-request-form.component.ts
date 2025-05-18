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
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';



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
    MatButtonModule,
    MatIconModule
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
  soldeConges: number = 0;
  dureeDemandee: number = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CongesRequestFormComponent>,
    private congesService: CongesService,
    private usersService: UserService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.congeForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.loadSolde();
  }

  async loadSolde() {
    try {
      const userInfo = await this.usersService.getMyInfo().toPromise();
      this.soldeConges = userInfo.soldeConges || 0;
    } catch (error) {
      console.error('Erreur lors du chargement du solde', error);
    }
  }

  calculateDuree() {
    if (this.congeForm.value.startDate && this.congeForm.value.endDate) {
      const start = new Date(this.congeForm.value.startDate);
      const end = new Date(this.congeForm.value.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.dureeDemandee = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  onSubmit() {
    if (this.congeForm.invalid) {
      this.toastr.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.dureeDemandee > this.soldeConges) {
      this.toastr.error(`Solde insuffisant. Vous avez ${this.soldeConges} jours disponibles mais demandez ${this.dureeDemandee} jours.`);
      return;
    }

    this.congesService.create(this.congeForm.value).subscribe({
      next: () => {
        this.toastr.success('Demande de congé envoyée avec succès');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Erreur lors de la demande');
      }
    });
  }


  onCancel(): void {
    this.dialogRef.close(false);
  }
}