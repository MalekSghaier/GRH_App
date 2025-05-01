import {  AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {  MatSortModule } from '@angular/material/sort';
import {  MatPaginatorModule } from '@angular/material/paginator';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { PointageService } from '../../services/pointage.service';
import moment from 'moment';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatDialog } from '@angular/material/dialog';
import { ScanQrDialogComponent } from '../scan-qr-dialog/scan-qr-dialog.component'; 
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';




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
    MatTooltipModule,
    ZXingScannerModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pointage-employ.component.html',
  styleUrl: './pointage-employ.component.css',
  encapsulation: ViewEncapsulation.None
  
})
export class PointageEmployComponent implements AfterViewInit,OnInit{
  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;

  loading = false;
  scannerEnabled = false;
  hasPermission = false;
  selectedDevice: MediaDeviceInfo | undefined;
  qrResult: any;
  pointages: any[] = [];
  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  months = [
    { value: 1, name: 'Janvier' },
    { value: 2, name: 'Février' },
    { value: 3, name: 'Mars' },
    { value: 4, name: 'Avril' },
    { value: 5, name: 'Mai' },
    { value: 6, name: 'Juin' },
    { value: 7, name: 'Juillet' },
    { value: 8, name: 'Aôut' },
    { value: 9, name: 'Septembre' },
    { value: 10, name: 'Octobre' },
    { value: 11, name: 'Novembre' },
    { value: 12, name: 'Décembre' }
  ];
  years = [2023, 2024, 2025]; 
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  monthControl = new FormControl(this.selectedMonth);
  yearControl = new FormControl(this.selectedYear);


  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private pointageService: PointageService,
    private dialog: MatDialog 


  ) {}

  ngOnInit() {
    this.loadPointages();
    this.loadPointagesForMonth();
    this.monthControl.valueChanges.subscribe(() => this.loadPointagesForMonth());
    this.yearControl.valueChanges.subscribe(() => this.loadPointagesForMonth());
  }

  ngAfterViewInit() {
    this.initializeSidebar();
  }
  private initializeSidebar(): void {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

    allSideMenu.forEach(item => {
      const li = item.parentElement;

      if (li) {
        item.addEventListener('click', function () {
          allSideMenu.forEach(i => {
            if (i.parentElement) {
              i.parentElement.classList.remove('active');
            }
          });
          li.classList.add('active');
        });
      }
    });

    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    if (menuBar && sidebar) {
      menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
      });
    }

    window.addEventListener('load', this.adjustSidebar);
    window.addEventListener('resize', this.adjustSidebar);
  }

  private adjustSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) { 
      if (window.innerWidth <= 576) {
        sidebar.classList.add('hide');
        sidebar.classList.remove('show');
      } else {
        sidebar.classList.remove('hide');
        sidebar.classList.add('show');
      }
    }
  }

  async loadPointagesForMonth() {
    if (!this.authService.isLoggedIn()) return;
    
    try {
      const currentUser = this.authService.getCurrentUser();
      this.pointages = await this.pointageService
        .getMonthlyPointages(
          currentUser.id, 
          this.monthControl.value!, 
          this.yearControl.value!
        )
        .toPromise() || [];
    } catch (error) {
      console.error('Erreur chargement pointages:', error);
    }
  }

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

async toggleScanner() {
  const dialogRef = this.dialog.open(ScanQrDialogComponent, {
    width: '400px',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.handleQrCodeResult(result);
    }
  });
}


checkScannerPermissions() {
  this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
    this.hasPermission = true;
    this.selectedDevice = devices[0];
  });
  
  this.scanner.permissionResponse.subscribe((perm: boolean) => {
    this.hasPermission = perm;
    if (!perm) {
      this.toastr.warning('Vous devez autoriser l\'accès à la caméra');
    }
  });
}

handleQrCodeResult(resultString: string) {
  try {
    const qrData = JSON.parse(resultString);
    if (qrData.id) {
      this.enregistrerPointage(qrData.id);
    } else {
      this.toastr.error('QR Code invalide');
    }
  } catch (e) {
    this.toastr.error('QR Code invalide');
  }
  this.scannerEnabled = false;
}


async enregistrerPointage(userId: string) {
  this.loading = true;
  try {
    const response = await this.pointageService.enregistrerPointage(userId).toPromise();
    this.toastr.success(response.message);
    
    // Actualiser la liste des pointages
    await this.loadPointages();
  } catch (error: any) {
    this.toastr.error(error.error?.message || 'Erreur lors de l\'enregistrement');
  } finally {
    this.loading = false;
  }
}

async loadPointages() {
  if (!this.authService.isLoggedIn()) return;
  
  try {
    const currentUser = this.authService.getCurrentUser();
    const pointages = await this.pointageService.getPointagesUtilisateur(currentUser.id).toPromise();
    this.pointages = pointages || [];
  } catch (error) {
    console.error('Erreur chargement pointages:', error);
  }
}

formatDate(date: string): string {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
}


}
