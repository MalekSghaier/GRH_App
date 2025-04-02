import { Component, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobOfferFormComponent } from '../job-offer-form/job-offer-form.component';
import { JobOffersService } from '../../services/job-offers.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-offres-emploi',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule,
    SharedSidebarComponent,
    SharedNavbarComponent,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './offres-emploi.component.html',
  styleUrls: ['./offres-emploi.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OffresEmploiComponent implements AfterViewInit, OnInit {
  offers: any[] = [];
  displayedColumns: string[] = ['title', 'company', 'location', 'actions'];

  constructor(
    private dialog: MatDialog,
    private jobOffersService: JobOffersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
  }

  loadOffers(): void {
    this.jobOffersService.getJobOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
      },
      error: (err) => {
        this.snackBar.open('Erreur lors du chargement des offres', 'Fermer', {
          duration: 3000
        });
        console.error(err);
      }
    });
  }

  openAddOfferDialog(): void {
    const dialogRef = this.dialog.open(JobOfferFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOffers();
      }
    });
  }

  deleteOffer(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.jobOffersService.deleteJobOffer(id).subscribe({
        next: () => {
          this.snackBar.open('Offre supprimée avec succès', 'Fermer', {
            duration: 3000
          });
          this.loadOffers();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
          console.error(err);
        }
      });
    }
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
}