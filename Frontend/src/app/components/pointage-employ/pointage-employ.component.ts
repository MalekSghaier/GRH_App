import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { CongesRequestFormComponent } from '../conges-request-form/conges-request-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { ToastrService } from 'ngx-toastr';
import { CongesService } from '../../services/conges.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pointage-employ',
  imports: [
    SharedNavbarComponent,
    SharedSidebarComponent,
    CommonModule,
    MatTabsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './pointage-employ.component.html',
  styleUrl: './pointage-employ.component.css'
})
export class PointageEmployComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  loading = false;
 async getQrCodeAndSendEmail() {
  if (!this.authService.isLoggedIn()) {
    this.toastr.error('Veuillez vous connecter d\'abord');
    return;
  }

  this.loading = true;
  try {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.toastr.error('Impossible de récupérer les informations utilisateur');
      return;
    }

    await this.userService.generateQrCodeAndSendEmail(currentUser.id).toPromise();
    this.toastr.success('QR Code envoyé à votre adresse email avec succès');
  } catch (error) {
    console.error('Erreur:', error);
    this.toastr.error('Une erreur est survenue');
  } finally {
    this.loading = false;
  }
}
}
