import { Component, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InternshipOfferFormComponent } from '../internship-offer-form/internship-offer-form.component';
import { InternshipOffersService } from '../../services/internship-offers.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { EditInternshipOfferComponent } from '../edit-internship-offer/edit-internship-offer.component';
import { InternshipApplicationsService } from '../../services/internship-applications.service';
import { InterviewFormComponent } from '../interview-form/interview-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-internship-offers',
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './internship-offers.component.html',
  styleUrls: ['./internship-offers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InternshipOffersComponent implements AfterViewInit, OnInit {
  private searchTerms = new Subject<string>();
  private appSearchTerms = new Subject<string>();

  offers: any[] = [];
  displayedColumns: string[] = ['title', 'duration', 'educationLevel', 'requirements', 'createdAt', 'actions'];
  noDataMessage = "Aucune offre disponible";
  applications: any[] = [];
  filteredApplications: any[] = [];
  statusFilter: string = 'all';
  totalCount: number = 0;
  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;

  constructor(
    private dialog: MatDialog,
    private internshipOffersService: InternshipOffersService,
    private toastr: ToastrService,
    private internshipApplicationsService: InternshipApplicationsService,
    private route: ActivatedRoute
  ) {}

  selectedTabIndex = 0;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      
      if (tab === 'mes-offres') {
        this.selectedTabIndex = 1;
      } else if (tab === 'candidatures') {
        this.selectedTabIndex = 2;
      } else {
        this.selectedTabIndex = 0;
      }

      if (this.selectedTabIndex === 1) {
        this.loadMyOffers();
      } else if (this.selectedTabIndex === 2) {
        this.loadApplications();
      }
    });

    this.loadMyOffers();
    this.loadApplications();
    this.loadPendingCount();

    // Configuration de la recherche pour les offres
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (query && query.trim() !== '') {
          return this.internshipOffersService.searchInternshipOffers(query);
        } else {
          return this.internshipOffersService.getMyInternshipOffers();
        }
      })
    ).subscribe({
      next: (offers) => {
        this.offers = offers.map(offer => ({
          ...offer,
          duration: `${offer.duration} mois`,
          createdAt: new Date(offer.createdAt)
        }));
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la recherche', 'Erreur');
        console.error(err);
      }
    });

    // Configuration de la recherche pour les applications
    this.appSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        const companyName = localStorage.getItem('companyName');
        if (!companyName) return of([]);
        
        if (query && query.trim() !== '') {
          return this.internshipApplicationsService.searchApplications(query, companyName);
        } else {
          return this.internshipApplicationsService.getApplicationsByCompany(companyName);
        }
      })
    ).subscribe({
      next: (apps) => {
        this.applications = apps.map(app => ({
          ...app,
          createdAt: new Date(app.createdAt),
          status: app.status === 'En cours de traitement' ? 'En attente' : app.status
        }));
        this.filterApplications();
        this.updateCounts();
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la recherche des candidatures', 'Erreur');
        console.error(err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
  }

  // Méthodes pour les offres
  loadMyOffers(): void {
    this.internshipOffersService.getMyInternshipOffers().subscribe({
      next: (offers) => {
        this.offers = offers.map(offer => ({
          ...offer,
          duration: `${offer.duration} mois`,
          createdAt: new Date(offer.createdAt)
        }));
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement des offres', 'Erreur');
        console.error(err);
      }
    });
  }

  search(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerms.next(inputElement.value);
  }

  openAddOfferDialog(): void {
    const dialogRef = this.dialog.open(InternshipOfferFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMyOffers();
      }
    });
  }

  openEditOfferDialog(offer: any): void {
    const originalCreatedBy = offer.createdBy;
  
    const dialogRef = this.dialog.open(EditInternshipOfferComponent, {
      width: '600px',
      data: { 
        offer: {
          ...offer,
          duration: typeof offer.duration === 'string' 
            ? parseInt(offer.duration.replace(' mois', '')) 
            : offer.duration
        }
      }
    });
  
    dialogRef.afterClosed().subscribe(updatedOffer => {
      if (updatedOffer) {
        const index = this.offers.findIndex(o => o._id === updatedOffer._id);
        if (index !== -1) {
          this.offers[index] = {
            ...updatedOffer,
            createdBy: originalCreatedBy,
            duration: `${updatedOffer.duration} mois`
          };
          this.offers = [...this.offers];
        }
      }
    });
  }

  deleteOffer(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.internshipOffersService.deleteInternshipOffer(id).subscribe({
        next: () => {
          this.toastr.success('Offre supprimée avec succès', 'Succès');
          this.loadMyOffers();
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la suppression', 'Erreur');
          console.error(err);
        }
      });
    }
  }

  loadApplications(): void {
    const companyName = localStorage.getItem('companyName');
    if (!companyName) return;
  
    this.internshipApplicationsService.getApplicationsByCompany(companyName).subscribe({
      next: (apps) => {
        this.applications = apps.map(app => ({
          ...app,
          createdAt: new Date(app.createdAt),
          status: app.status === 'En cours de traitement' ? 'En attente' : app.status
        }));
        this.filterApplications();
        this.updateCounts();
      },
      error: (err) => {
        console.error('Erreur chargement applications', err);
        this.filteredApplications = [];
        this.updateCounts();
      }
    });
  }

  searchApplications(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.appSearchTerms.next(inputElement.value);
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.filterApplications();
  }

  filterApplications(): void {
    if (this.statusFilter === 'all') {
      this.filteredApplications = [...this.applications];
    } else {
      this.filteredApplications = this.applications.filter(app => 
        app.status === this.statusFilter || 
        (this.statusFilter === 'En attente' && app.status === 'En cours de traitement')
      );
    }
  }

  updateCounts(): void {
    this.totalCount = this.applications.length;
    this.pendingCount = this.applications.filter(app => 
      app.status === 'En attente' || app.status === 'En cours de traitement'
    ).length;
    this.approvedCount = this.applications.filter(app => app.status === 'Approuvé').length;
    this.rejectedCount = this.applications.filter(app => app.status === 'Rejeté').length;
  }

  loadPendingCount(): void {
    const companyName = localStorage.getItem('companyName');
    if (!companyName) return;

    this.internshipApplicationsService.getPendingApplicationsCount(companyName).subscribe({
      next: (response) => {
        this.pendingCount = response.count;
      },
      error: (err) => {
        console.error('Erreur chargement compteur candidatures', err);
      }
    });
  }

  updateStatus(appId: string, status: string): void {
    if (status === 'Rejeté') {
      this.internshipApplicationsService.updateStatus(appId, status).subscribe({
        next: () => {
          this.toastr.success('Demande de stage rejetée', 'Succès');
          this.loadApplications();
        },
        error: (err) => this.toastr.error('Erreur mise à jour', 'Erreur')
      });
    } else if (status === 'Approuvé') {
      const dialogRef = this.dialog.open(InterviewFormComponent, {
        width: '450px',
        data: { applicationId: appId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadApplications();
        }
      });
    }
  }

  // Méthodes pour la sidebar
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