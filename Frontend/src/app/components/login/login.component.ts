import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode'; 
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewUserDialogComponent } from '../../new-user-dialog/new-user-dialog.component';
import { PointageService } from '../../services/pointage.service';
import { ScanQrDialogComponent } from '../scan-qr-dialog/scan-qr-dialog.component';


interface PointageResponse {
  message: string;
  type?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  newUserImageId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog, 
    private pointageService: PointageService,

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Email ou mot de passe incorrect';
      this.successMessage = '';
      this.toastr.error('Email ou mot de passe incorrect', 'Erreur', {
        timeOut: 1500,
        progressBar: true
      });
      return;
    }

    this.http.post('http://localhost:3000/auth/login', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          const token = response.access_token;
          localStorage.setItem('token', token);
          
          const decodedToken: any = jwtDecode(token); 
          const role = decodedToken.role;

          // Affichage du message de succès
          this.successMessage = "Ravi de vous retrouver ! Gérez vos demandes et accédez à vos documents en toute sérénité.";
          this.errorMessage = ''; 
          this.toastr.success(this.successMessage, "Bienvenue", {
            timeOut: 1500,
            progressBar: true
          });

          // Rediriger l'utilisateur en fonction de son rôle
          if (role === 'superAdmin') {
            setTimeout(() => {
            this.router.navigate(['/superadmin-dashboard']);
          }, 1500);
          } else if (role === 'admin') {
            setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 1500);
          } else if (role === 'employé') {
            setTimeout(() => {
            this.router.navigate(['/employee-dashboard']);
          }, 1500);
          } else if (role === 'stagiaire') {
            setTimeout(() => {
            this.router.navigate(['/intern-dashboard']);
          }, 1500);

          } 
        },
        error: () => {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.successMessage = '';
          this.toastr.error(this.errorMessage, 'Erreur', {
            timeOut: 1500,
            progressBar: true
          });
        }
      });
  }



pointageRF() {
  this.toastr.info('Lancement de la reconnaissance faciale...', 'Veuillez patienter', {
    timeOut: 3000,
    progressBar: true
  });

  this.http.get<any>('http://localhost:3000/python/launch')
    .subscribe({
      next: (response) => {
        if (response.status === 'success' && response.image_id) {
          // Trouver l'utilisateur par image
          this.http.get<any>(`http://localhost:3000/python/find-by-image/${response.image_id}`)
            .subscribe({
              next: (userResponse) => {
                if (!userResponse || !userResponse._id) { // Vérification ajoutée
                  throw new Error('User information incomplete');
                }
                
                // Effectuer le pointage avec le bon format de données
                this.http.post<any>(
                  'http://localhost:3000/pointage/scan-face', 
                  { userId: userResponse._id }, // Format correct des données
                  { 
                    headers: { 
                      'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    } 
                  }
                ).subscribe({
                  next: (pointageResponse) => {
                    this.toastr.success(
                      `${pointageResponse.message} pour ${userResponse.name}`,
                      'Pointage enregistré',
                      { timeOut: 5000, progressBar: true }
                    );
                  },
                  error: (pointageErr) => {
                    this.toastr.error(
                      pointageErr.error?.message || 'Erreur lors du pointage',
                      'Erreur',
                      { timeOut: 5000, progressBar: true }
                    );
                  }
                });
              },
              error: (userErr) => {
                console.error('Erreur utilisateur:', userErr);
                this.toastr.warning(
                  'Utilisateur reconnu mais informations non trouvées',
                  'Attention',
                  { timeOut: 5000, progressBar: true }
                );
              }
            });
        } else if (response.status === 'info') {
          this.openNewUserDialog();
        } else {
          this.toastr.warning(response.message || 'Réponse inattendue', 'Attention', {
            timeOut: 5000,
            progressBar: true
          });
        }
      },
      error: (err) => {
        console.error('Erreur HTTP:', err);
        this.toastr.error(
          err.error?.message || err.message || 'Erreur de communication avec le serveur',
          'Erreur',
          { timeOut: 5000, progressBar: true }
        );
      }
    });
}
  openNewUserDialog(): void {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '550px',
      data: { imageId: this.newUserImageId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.registerNewUserWithImage(result);
      } else {
        this.toastr.info('Enregistrement annulé', 'Information');
      }
    });
  }


registerNewUserWithImage(userData: any): void {
  this.http.get<any>('http://localhost:3000/python/capture')
    .subscribe({
      next: (captureResponse) => {
        if (captureResponse.status === 'success' && captureResponse.image_id) {
          const payload = {
            user: {
              name: userData.name,
              email: userData.email,
              company: userData.company, 
              role: userData.role,
              password: userData.password
            },
            imageId: captureResponse.image_id
          };
          
          this.http.post<{ user: any, message: string }>('http://localhost:3000/users/with-image', payload)
            .subscribe({
              next: (response) => {
                this.toastr.success(
                  `Nouvel utilisateur enregistré: ${response.user.name}`,
                  'Succès',
                  { timeOut: 5000, progressBar: true }
                );
              },
              error: (err) => {
                this.toastr.error(
                  'Erreur lors de l\'enregistrement',
                  'Erreur',
                  { timeOut: 5000, progressBar: true }
                );
                console.error(err);
              }
            });
        }
      }
    });
}


pointageQR() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.toastr.error('Veuillez vous connecter d\'abord', 'Erreur');
    return;
  }

  const decodedToken: any = jwtDecode(token);
  const userId = decodedToken.id;

  this.toastr.info('Prêt à scanner le QR Code', 'Positionnez le QR Code', {
    timeOut: 3000,
    progressBar: true
  });

  this.pointageService.enregistrerPointage(userId).subscribe({
    next: (response: PointageResponse) => {
      this.toastr.success(response.message, 'Pointage enregistré', {
        timeOut: 5000,
        progressBar: true
      });
    },
    error: (err: any) => {
      this.toastr.error(
        err.error?.message || 'Erreur lors du pointage',
        'Erreur',
        { timeOut: 5000, progressBar: true }
      );
    }
  });
}
openQrScanner() {
  const dialogRef = this.dialog.open(ScanQrDialogComponent, {
    width: '80%',
    maxWidth: '600px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.toastr.success('Pointage effectué avec succès', 'Succès');
    }
  });
}
  
}