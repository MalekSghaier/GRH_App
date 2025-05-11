import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


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

  constructor(
    public dialogRef: MatDialogRef<ScanQrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient 

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
    });
  }

onScanSuccess(result: string) {
  try {
    const qrData = JSON.parse(result);
    if (qrData.id) {
      // Envoyer les données au backend
      this.http.post('http://localhost:3000/pointage/scan-qr-data', { qrData: result })
        .subscribe({
          next: (response: any) => {
            this.dialogRef.close();
            // Afficher un message de succès
            alert(response.message || 'Pointage enregistré avec succès');
          },
          error: (err) => {
            console.error('Erreur de pointage:', err);
            alert(err.error?.message || 'Erreur lors du pointage');
          }
        });
    } else {
      alert('QR code invalide - ID utilisateur manquant');
    }
  } catch (e) {
    alert('Format QR code invalide');
  }
}

  onClose() {
    this.dialogRef.close();
  }
}