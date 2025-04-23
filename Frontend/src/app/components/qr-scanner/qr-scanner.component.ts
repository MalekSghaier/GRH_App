import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BarcodeFormat } from '@zxing/browser'; // ← C'est ça qu’il faut !


@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule],
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent {
  allowedFormats = [BarcodeFormat.QR_CODE];
  scanResult: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  onCodeResult(resultString: string): void {
    this.scanResult = resultString;
    this.enregistrerPointage(resultString);
  }

  enregistrerPointage(userId: string) {
    this.http.post(`http://localhost:3000/${userId}/pointage`, {})
      .subscribe({
        next: (response: any) => {
          this.message = response;
        },
        error: err => {
          console.error('Erreur pointage:', err);
          this.message = "Erreur lors du pointage.";
        }
      });
  }
}
