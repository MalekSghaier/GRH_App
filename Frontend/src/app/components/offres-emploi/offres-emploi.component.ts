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
import { ToastrService } from 'ngx-toastr';
import { EditJobOfferComponent } from '../edit-job-offer/edit-job-offer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkApplicationsService } from '../../services/work-applications.service';



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
  displayedColumns: string[] = ['title', 'experienceRequired', 'educationLevel', 'jobRequirements', 'actions'];  
  noDataMessage = "Aucune offre disponible";
  applications: any[] = [];
  appDisplayedColumns: string[] = [
    'position', 
    'fullName', 
    'email', 
    'phone', 
    'cv', 
    'coverLetter', 
    'availability', 
    'actions'
  ];

  constructor(
    private dialog: MatDialog,
    private jobOffersService: JobOffersService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private http: HttpClient,
    private workApplicationsService: WorkApplicationsService,

  ) {}

  ngOnInit(): void {
    this.loadMyOffers();
    this.loadApplications();

  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
  }



  loadMyOffers(): void {
    this.jobOffersService.getMyJobOffers().subscribe({
      next: (offers) => {
        this.offers = offers.map(offer => ({
          ...offer,
          experienceRequired: `${offer.experienceRequired} ans` // Formatage de l'expérience
        }));
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement de vos offres', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
        console.error(err);
      }
    });
  }
loadApplications(): void {
  const companyName = localStorage.getItem('companyName');
  if (!companyName) return;

  this.workApplicationsService.getApplicationsByCompany(companyName).subscribe({
    next: (apps) => this.applications = apps,
    error: (err) => console.error('Erreur chargement applications', err)
  });
}
updateStatus(appId: string, status: string): void {
  this.workApplicationsService.updateStatus(appId, status).subscribe({
    next: () => {
      this.toastr.success('Statut mis à jour', 'Succès');
      this.loadApplications();
    },
    error: (err) => this.toastr.error('Erreur mise à jour', 'Erreur')
  });
}
  openAddOfferDialog(): void {
    const dialogRef = this.dialog.open(JobOfferFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMyOffers();
      }
    });
  }
  openEditOfferDialog(offer: any): void {
    // Sauvegarder l'ObjectId original
    const originalCreatedBy = offer.createdBy;
  
    const dialogRef = this.dialog.open(EditJobOfferComponent, {
      width: '600px',
      data: { 
        offer: {
          ...offer,
          experienceRequired: typeof offer.experienceRequired === 'string' 
            ? parseInt(offer.experienceRequired.replace(' ans', '')) 
            : offer.experienceRequired
        }
      }
    });
  
    dialogRef.afterClosed().subscribe(updatedOffer => {
      if (updatedOffer) {
        // Mise à jour locale en conservant le format original
        const index = this.offers.findIndex(o => o._id === updatedOffer._id);
        if (index !== -1) {
          this.offers[index] = {
            ...updatedOffer,
            createdBy: originalCreatedBy, // Garde l'ObjectId
            experienceRequired: `${updatedOffer.experienceRequired} ans`
          };
          this.offers = [...this.offers]; // Nouvelle référence
        }
      }
    });
  }

  deleteOffer(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.jobOffersService.deleteJobOffer(id).subscribe({
        next: () => {
          this.toastr.success('Offre supprimée avec succès', 'Succès', {
            timeOut: 1500,
            progressBar: true
          });
          this.loadMyOffers();
        },
        error: (err) => {
          this.toastr.error('Erreur lors du chargement de vos offres', 'Erreur', {
            timeOut: 1500,
            progressBar: true
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