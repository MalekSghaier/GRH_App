import { Component,ViewEncapsulation,AfterViewInit, OnInit } from '@angular/core';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { DocumentRequest } from '../../models/document-request.model';
import { CommonModule } from '@angular/common';
import {  Router, RouterModule } from '@angular/router';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { ToastrService } from 'ngx-toastr';
import { DocumentApprovalFormComponent } from '../document-approval-form/document-approval-form.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-document-requests-list',
  imports: [SharedNavbarComponent,SharedSidebarComponent,CommonModule,RouterModule],
  templateUrl: './document-requests-list.component.html',
  styleUrl: './document-requests-list.component.css',
  encapsulation: ViewEncapsulation.None 

})
export class DocumentRequestsListComponent implements AfterViewInit, OnInit {

  documentRequests: DocumentRequest[] = [];
  filteredRequests: DocumentRequest[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  pendingCount: number = 0;
  inProgressCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  filter: 'pending' | 'in_progress' | 'approved' | 'rejected' = 'pending';
    documentRequest: DocumentRequest = {
    _id: '',
    fullName: '',
    jobPosition: '',
    contractType: '',
    professionalEmail: '',
    documentType: '',
    userId: '',
    status: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  constructor(
    private documentRequestsService: DocumentRequestsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.loadDocumentRequests();
    this.loadStats();
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  
  loadDocumentRequests(): void {
    this.isLoading = true;
    this.documentRequestsService.getCompanyDocumentRequestsPaginated(
      this.currentPage, 
      this.itemsPerPage,
      this.filter
    ).subscribe({
      next: (response) => {
        this.documentRequests = response.data;
        this.filteredRequests = [...this.documentRequests];
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes:', err);
        this.toastr.error('Erreur lors du chargement des demandes', 'Erreur');
        this.isLoading = false;
      }
    });
  }
  loadStats(): void {
    this.documentRequestsService.getDocumentStats().subscribe({
      next: (stats) => {
        this.pendingCount = stats.pending;
        this.inProgressCount = stats.in_progress;
        this.approvedCount = stats.approved;
        this.rejectedCount = stats.rejected;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
      }
    });
  }
// Modifier la méthode filterRequests
filterRequests(statusKey: 'pending' | 'in_progress' | 'approved' | 'rejected'): void {
  this.filter = statusKey;
  this.currentPage = 1;
  
  this.isLoading = true;
  this.documentRequestsService.getCompanyDocumentRequestsPaginated(
    this.currentPage, 
    this.itemsPerPage,
    statusKey // Envoyer directement la clé au service
  ).subscribe({
    next: (response) => {
      this.documentRequests = response.data;
      this.filteredRequests = [...this.documentRequests];
      this.totalItems = response.total;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Erreur lors du chargement:', err);
      this.toastr.error('Erreur lors du chargement des demandes', 'Erreur');
      this.isLoading = false;
    }
  });
}

// Modifier getStatusText pour gérer les valeurs du backend
getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    'En attente': 'En attente',
    'En cours de traitement': 'En cours',
    'Approuvée': 'Approuvé',
    'Rejetée': 'Rejeté'
  };
  return statusMap[status] || status;
}

getStatusClass(status: string): string {
  const statusMap: { [key: string]: string } = {
    'En attente': 'pending',
    'En cours de traitement': 'in_progress',
    'Approuvée': 'approved',
    'Rejetée': 'rejected'
  };
  return statusMap[status] || '';
}
  updateStatus(id: string, status: string): void {
    if (confirm(`Êtes-vous sûr de vouloir ${status === 'approved' ? 'approuver' : 'rejeter'} cette demande ?`)) {
      this.documentRequestsService.updateRequestStatus(id, status).subscribe({
        next: () => {
          this.toastr.success(`Demande ${status === 'approved' ? 'approuvée' : 'rejetée'}`, 'Succès');
          this.loadDocumentRequests();
          this.loadStats();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.toastr.error('Erreur lors de la mise à jour', 'Erreur');
        }
      });
    }
  }
// Ajouter cette méthode à votre composant
openApprovalDialog(requestId: string, requestData: DocumentRequest): void {
  const dialogRef = this.dialog.open(DocumentApprovalFormComponent, {
    width: '400px',
    height: 'auto',
    maxHeight: 'none',
    panelClass: 'custom-dialog',
    data: {
      requestId: requestId,
      requestData: requestData
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.toastr.success('Demande approuvée et document envoyé', 'Succès');
      // Recharger les données si nécessaire
      this.loadDocumentRequests();
      this.loadStats();
    }
  });
}
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDocumentRequests();
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDocumentRequests();
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDocumentRequests();
  }

  updateRequestStatus(id: string, status: string): void {
    this.documentRequestsService.updateRequestStatus(id, status)
      .subscribe({
        next: (updatedRequest) => {
          this.toastr.success('Statut de la demande mis à jour', 'Succès');
          // Supprimer la demande mise à jour du tableau
          this.documentRequests = this.documentRequests.filter(req => req._id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.toastr.error('Erreur lors de la mise à jour', 'Erreur');
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
 
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
