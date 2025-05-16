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
import { JobOfferFormComponent } from '../job-offer-form/job-offer-form.component';
import { JobOffer, JobOffersService } from '../../services/job-offers.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { EditJobOfferComponent } from '../edit-job-offer/edit-job-offer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkApplicationsService } from '../../services/work-applications.service';
import { InterviewFormComponent } from '../interview-form/interview-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


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
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './offres-emploi.component.html',
  styleUrls: ['./offres-emploi.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OffresEmploiComponent implements AfterViewInit, OnInit {
  private searchTerms = new Subject<string>();
  private appSearchTerms = new Subject<string>();


  offers: any[] = [];
  displayedColumns: string[] = ['title', 'experienceRequired', 'educationLevel', 'jobRequirements',  'createdAt','actions'];  
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
    'createdAt',
    'actions'
  ];


  pendingCount: number = 0;


  constructor(
    private dialog: MatDialog,
    private jobOffersService: JobOffersService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private http: HttpClient,
    private workApplicationsService: WorkApplicationsService,
    private route: ActivatedRoute

    

  ) {}

  selectedTabIndex = 0; 

  ngOnInit(): void {

    this.loadMyOffers();
    this.loadApplications();


    this.route.queryParams.subscribe(params => {
    const tab = params['tab'];
    
    // Définir l'onglet sélectionné en fonction du paramètre
    if (tab === 'mes-offres') {
      this.selectedTabIndex = 1; // Index de l'onglet "Mes offres publiées"
    } else if (tab === 'candidatures') {
      this.selectedTabIndex = 2; // Index de l'onglet "Candidatures reçues"
    } else {
      this.selectedTabIndex = 0; // Onglet par défaut
    }

    // Charger les données appropriées
    if (this.selectedTabIndex === 1) {
      this.loadMyOffers();
    } else if (this.selectedTabIndex === 2) {
      this.loadApplications();
    }
  });

  this.loadPendingCount();
    // Configurez la recherche réactive
    this.searchTerms.pipe(
      debounceTime(300), // Délai de 300ms après la dernière frappe
      distinctUntilChanged(), // Ignore si le terme n'a pas changé
      switchMap((query: string) => {
        if (query && query.trim() !== '') {
          return this.jobOffersService.searchJobOffers(query);
        } else {
          // Si la recherche est vide, rechargez les offres normales
          return this.jobOffersService.getMyJobOffers();
        }
      })
    ).subscribe({
      next: (offers) => {
        this.offers = offers.map(offer => ({
          ...offer,
          experienceRequired: `${offer.experienceRequired} ans`
        }));
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la recherche', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
        console.error(err);
      }
    });

    this.appSearchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        const companyName = localStorage.getItem('companyName');
        if (!companyName) return of([]);
        
        if (query && query.trim() !== '') {
          return this.workApplicationsService.searchApplications(query, companyName);
        } else {
          return this.workApplicationsService.getApplicationsByCompany(companyName);
        }
      })
    ).subscribe({
      next: (apps) => {
        this.applications = apps;
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la recherche des candidatures', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
        console.error(err);
      }
    });
  }

  // Ajoutez cette méthode pour gérer l'input de recherche
  search(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerms.next(inputElement.value);
  }

  searchApplications(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.appSearchTerms.next(inputElement.value);
  }


  ngAfterViewInit(): void {
    this.initializeSidebar();
  }



  loadMyOffers(): void {
    this.jobOffersService.getMyJobOffers().subscribe({
      next: (offers) => {
        this.offers = offers.map(offer => ({
          ...offer,
          experienceRequired: `${offer.experienceRequired} ans`, // Formatage de l'expérience
          createdAt: new Date(offer.createdAt) // Conversion en Date

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
      next: (apps) => {
        this.applications = apps.map(app => ({
          ...app,
          createdAt: new Date(app.createdAt) // Conversion en Date
        }));
      },
      error: (err) => console.error('Erreur chargement applications', err)
    });
  }

loadPendingCount(): void {
  const companyName = localStorage.getItem('companyName');
  if (!companyName) return;

  this.workApplicationsService.getPendingApplicationsCount(companyName).subscribe({
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
    this.workApplicationsService.updateStatus(appId, status).subscribe({
      next: () => {
        this.toastr.error('Demande de travail rejetée', 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
        window.location.reload();
      },
      error: (err) => this.toastr.error('Erreur mise à jour', 'Erreur', {
        timeOut: 1500,
        progressBar: true
      })
    });
  } else if (status === 'Approuvé') {
    const dialogRef = this.dialog.open(InterviewFormComponent, {
      width: '450px',
      data: { applicationId: appId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }
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

  openInterviewDialog() {
    this.dialog.open(InterviewFormComponent, {
      // vos configurations de dialog
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