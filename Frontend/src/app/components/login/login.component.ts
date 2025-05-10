import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode'; 
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewUserDialogComponent } from '../../new-user-dialog/new-user-dialog.component';

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
    private dialog: MatDialog

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



//   pointageRF() {
//     this.toastr.info('Lancement de la reconnaissance faciale...', 'Veuillez patienter', {
//       timeOut: 3000,
//       progressBar: true
//     });
  
//     this.http.get<any>('http://localhost:3000/python/launch')
//       .subscribe({
//         next: (response) => {
//           if (response.status === 'success') {
//             this.toastr.success(response.message, 'Reconnaissance réussie', {
//               timeOut: 5000,
//               progressBar: true
//             });
//           } else if (response.status === 'info') {
//             this.openNewUserDialog();
//           } else {
//             this.toastr.warning(response.message || 'Réponse inattendue', 'Attention', {
//               timeOut: 5000,
//               progressBar: true
//             });
//           }
//         },
//         error: (err) => {
//           console.error('Erreur HTTP:', err);
//           this.toastr.error(
//             err.error?.message || err.message || 'Erreur de communication avec le serveur',
//             'Erreur',
//             { timeOut: 5000, progressBar: true }
//           );
//         }
//       });
// }

pointageRF() {
  this.toastr.info('Lancement de la reconnaissance faciale...', 'Veuillez patienter', {
    timeOut: 3000,
    progressBar: true
  });

  this.http.get<any>('http://localhost:3000/python/launch')
    .subscribe({
      next: (response) => {
        if (response.status === 'success' && response.image_id) {
          // Utilisez le bon endpoint python/find-by-image
          this.http.get<any>(`http://localhost:3000/python/find-by-image/${response.image_id}`)
            .subscribe({
              next: (userResponse) => {
                this.toastr.success(
                  `Utilisateur reconnu: ${userResponse.name}`,
                  'Reconnaissance réussie',
                  { timeOut: 5000, progressBar: true }
                );
              },
              error: (userErr) => {
                console.error('Erreur lors de la récupération des infos utilisateur:', userErr);
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
  
// registerNewUserWithImage(userData: any): void {
//   // D'abord capturer l'image
//   this.http.get<any>('http://localhost:3000/python/capture')
//     .subscribe({
//       next: (captureResponse) => {
//         if (captureResponse.status === 'success' && captureResponse.image_id) {
//           // Ensuite créer l'utilisateur avec l'image capturée
//           const payload = {
//             user: {
//               name: userData.name,
//               email: userData.email,
//               company: userData.company, 
//               role: userData.role,
//               password: userData.password
//             },
//             imageId: captureResponse.image_id
//           };
          
//           this.http.post<{ user: any, message: string }>('http://localhost:3000/users/with-image', payload)
//             .subscribe({
//               next: (response) => {
//                 this.toastr.success(
//                   `${response.message}: ${response.user.name}`,
//                   'Succès',
//                   { timeOut: 5000, progressBar: true }
//                 );
//               },
//               error: (err) => {
//                 this.toastr.error(
//                   'Erreur lors de l\'enregistrement',
//                   'Erreur',
//                   { timeOut: 5000, progressBar: true }
//                 );
//                 console.error(err);
//               }
//             });
//         } else {
//           this.toastr.error(
//             'Erreur lors de la capture de l\'image',
//             'Erreur',
//             { timeOut: 5000, progressBar: true }
//           );
//         }
//       },
//       error: (err) => {
//         this.toastr.error(
//           'Erreur lors de la capture de l\'image',
//           'Erreur',
//           { timeOut: 5000, progressBar: true }
//         );
//         console.error(err);
//       }
//     });
// }

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
  
}