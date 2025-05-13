import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scan-qr-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ZXingScannerModule,
    MatIconModule,
    MatButtonModule
  ],
  
  templateUrl: './scan-qr-dialog.component.html',
  styleUrls: ['./scan-qr-dialog.component.css']
})
export class ScanQrDialogComponent {
  @ViewChild('scanner') scanner!: ZXingScannerComponent;
  formats = [BarcodeFormat.QR_CODE];
  hasPermission = false;
  selectedDevice: MediaDeviceInfo | undefined;
  scanning = false;


  constructor(
    public dialogRef: MatDialogRef<ScanQrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  ngAfterViewInit() {
    this.checkScannerPermissions();
  }

  checkScannerPermissions() {
    this.scanner.camerasFound.subscribe(devices => {
      this.hasPermission = true;
      this.selectedDevice = devices[0];
    });

    this.scanner.permissionResponse.subscribe(perm => {
      this.hasPermission = perm;
        if (!perm) {
        this.toastr.warning(
          'Permission de la caméra refusée',
          'Autorisation requise',
          { timeOut: 1500 }
        );
      }
    });
  }

onScanSuccess(result: string) {
  if (this.scanning) return;
  this.scanning = true;

  try {
    const qrData = JSON.parse(result);
    if (!qrData?.id) {
      throw new Error('ID utilisateur manquant dans le QR code');
    }
    this.toastr.info('Traitement du QR code...', 'Veuillez patienter', {
      timeOut: 500,
      disableTimeOut: true
    });
    if (qrData.id) {
      // Envoyer les données au backend
      this.http.post('http://localhost:3000/pointage/scan-qr-data', { qrData: result })
        .subscribe({
          next: (response: any) => {
            this.scanning = false;
            this.dialogRef.close(true);
            // Afficher un message de succès
            this.toastr.success(
              response.message || 'Pointage enregistré avec succès',
              'Succès',
              { timeOut: 1500, progressBar: true }
            );
          },
          error: (err) => {
            this.scanning = false;
            console.error('Erreur de pointage:', err);
            let errorMessage = 'Erreur lors du pointage';
            let errorTitle = 'Erreur';
            let timeOut = 1500;
            if (err.error?.code === 'FACE_ALREADY_USED') {
              errorMessage = 'Vous avez déjà pointé aujourd\'hui via reconnaissance faciale';
              errorTitle = 'Pointage déjà effectué';
              timeOut = 1500;
            } else if (err.error?.code === 'QR_ALREADY_USED') {
              errorMessage = 'Vous avez déjà pointé aujourd\'hui via QR code';
              errorTitle = 'Pointage déjà effectué';
              timeOut = 1500;
            } else if (err.error?.code === 'USER_NOT_FOUND') {
              errorMessage = 'Utilisateur non trouvé dans le système';
              errorTitle = 'Erreur utilisateur';
            } else if (err.error?.message) {
              errorMessage = err.error.message;
            }
            this.toastr.error(errorMessage, errorTitle, {
              timeOut,
              progressBar: true
        });
          }
        });
    } }
    catch (e) {
      this.scanning = false;
      this.toastr.error(
        'Format QR code invalide - Veuillez scanner un QR code valide',
        'Erreur de scan',
        { timeOut: 3000, progressBar: true }
      );
      }
}
  onClose() {
    this.dialogRef.close();
  }
}