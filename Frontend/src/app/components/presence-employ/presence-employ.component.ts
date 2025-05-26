// presence-employ.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';
import { PointageService } from '../../services/pointage.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-presence-employ',
  imports: [SharedNavbarComponent,SharedSidebarComponent,CommonModule, FormsModule, SharedNavbarComponent, SharedSidebarComponent],
  templateUrl: './presence-employ.component.html',
  styleUrls: ['./presence-employ.component.css'],
  standalone: true
})
export class PresenceEmployComponent implements OnInit {
  pointages: any[] = [];
  filteredPointages: any[] = [];
  isLoading = false;
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  errorMessage: string | null = null;

  months = [
    { value: 1, name: 'Janvier' },
    { value: 2, name: 'Février' },
    { value: 3, name: 'Mars' },
    { value: 4, name: 'Avril' },
    { value: 5, name: 'Mai' },
    { value: 6, name: 'Juin' },
    { value: 7, name: 'Juillet' },
    { value: 8, name: 'Août' },
    { value: 9, name: 'Septembre' },
    { value: 10, name: 'Octobre' },
    { value: 11, name: 'Novembre' },
    { value: 12, name: 'Décembre' }
  ];
  years: number[] = [];
  searchDate: string = '';

  constructor(
    private pointageService: PointageService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService:UserService,
    private toastr: ToastrService,


  ) {
    // Générer les 5 dernières années
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.loadPointages();
  }

async loadPointages(): Promise<void> {
  this.isLoading = true;
  this.errorMessage = null;
  
  try {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      throw new Error('Utilisateur non trouvé ou invalide');
    }

    const monthlyPointages = await lastValueFrom(
      this.pointageService.getMonthlyPointages(
        user.id,
        this.selectedMonth,
        this.selectedYear
      )
    );

    console.log('Données reçues:', monthlyPointages); // <-- Ajoutez cette ligne
    this.pointages = Array.isArray(monthlyPointages) ? [...monthlyPointages] : [];
    this.filteredPointages = [...this.pointages];
  } catch (err) {
    console.error('Error loading pointages:', err);
    this.errorMessage = 'Erreur lors du chargement des pointages';
    if (err instanceof HttpErrorResponse) {
      this.errorMessage = err.error.message || 'Erreur serveur';
    }
  } finally {
    this.isLoading = false;
    }
}

  filterByDate(): void {
    if (this.searchDate) {
      this.pointageService.getPointagesByDate(this.searchDate).subscribe({
        next: (pointages) => {
          this.filteredPointages = pointages;
        },
        error: (err) => {
          console.error('Error filtering by date:', err);
        }
      });
    } else {
      this.filteredPointages = [...this.pointages];
    }
  }

  onMonthYearChange(): void {
    this.loadPointages();
  }

formatHeuresTravail(pointage: any): string {
  // Si heuresTravail est déjà calculé côté backend
  if (pointage.heuresTravail) {
    const heures = pointage.heuresTravail;
    const heuresEntieres = Math.floor(heures);
    const minutes = Math.round((heures - heuresEntieres) * 60);
    return `${heuresEntieres}h${minutes.toString().padStart(2, '0')}`;
  }

  // Si on a les heures d'entrée et sortie, calculons nous-mêmes
  if (pointage.entree && pointage.sortie) {
    const [heuresEntree, minutesEntree] = pointage.entree.split(':').map(Number);
    const [heuresSortie, minutesSortie] = pointage.sortie.split(':').map(Number);
    
    const totalMinutesEntree = heuresEntree * 60 + minutesEntree;
    const totalMinutesSortie = heuresSortie * 60 + minutesSortie;
    
    const differenceMinutes = totalMinutesSortie - totalMinutesEntree;
    
    const heures = Math.floor(differenceMinutes / 60);
    const minutes = differenceMinutes % 60;
    
    return `${heures}h${minutes.toString().padStart(2, '0')}`;
  }

  return 'Non disponible';
}

  getStatusColor(entree: string, sortie: string): string {
    if (!sortie) return 'warning'; // En cours de travail
    return 'success'; // Journée complète
  }

  downloadQrCode(): void {
  const user = this.authService.getCurrentUser();
  if (!user || !user.id) {
    this.snackBar.open('Utilisateur non identifié', 'Fermer', { duration: 3000 });
    return;
  }

  this.userService.generateQrCodeAndSendEmail(user.id).subscribe({
    next: () => {
      this.toastr.success('QR Code envoyé par email avec succès', 'QR Code Envoyé', {
        timeOut: 1500,
        progressBar: true
      });
    },
    error: (err) => {
      console.error('Erreur lors de la génération du QR Code:', err);
      this.snackBar.open(
        err.error?.message || 'Erreur lors de la génération du QR Code', 
        'Fermer', 
        { duration: 3000 }
      );
    }
  });
}
}