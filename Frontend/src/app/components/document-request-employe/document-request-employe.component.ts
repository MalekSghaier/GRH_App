// document-request-employe.component.ts
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar-Employ/shared-sidebar.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentRequestFormComponent } from '../document-request-form/document-request-form.component';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { DocumentRequest } from '../../models/document-request.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-request-employe',
  imports: [
    SharedNavbarComponent,
    SharedSidebarComponent,
    CommonModule,
    MatTabsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule

  ],
  templateUrl: './document-request-employe.component.html',
  styleUrl: './document-request-employe.component.css',
  encapsulation: ViewEncapsulation.None
  
})
export class DocumentRequestEmployeComponent implements  AfterViewInit , OnInit {
  displayedColumns: string[] = ['documentType', 'createdAt', 'status', 'actions'];
  dataSource = new MatTableDataSource<DocumentRequest>();
  noDataMessage = "Aucune demande de document trouvée";
  myRequests: DocumentRequest[] = [];
  isLoading = false;
  filteredRequests: DocumentRequest[] = [];
  searchTerm = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
      private dialog: MatDialog,
      private documentRequestsService: DocumentRequestsService,
      private  toastr: ToastrService,
    ) {}

    ngOnInit(): void {
      this.loadMyRequests();
    }
    ngAfterViewInit() {
      this.initializeSidebar();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    loadMyRequests(): void {
      this.documentRequestsService.findRequestsByUser().subscribe({
        next: (requests) => {
          this.dataSource.data = requests;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des demandes', err);
        }
      });
    }

    getStatusClass(status: string): string {
      switch(status) {
        case 'Approuvée': return 'status-approved';
        case 'En cours de traitement': return 'status-pending';
        case 'Rejetée': return 'status-rejected';
        default: return '';
      }
    }

    search(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    searchRequests(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.searchTerm = input.value.toLowerCase();
      
      if (!this.searchTerm) {
        this.filteredRequests = [...this.myRequests];
        return;
      }
    
      this.filteredRequests = this.myRequests.filter(request => 
        request.documentType.toLowerCase().includes(this.searchTerm) ||
        request.status.toLowerCase().includes(this.searchTerm)
      );
    }
  
    openAddRequestDialog(): void {
      const dialogRef = this.dialog.open(DocumentRequestFormComponent, {
        width: '500px',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Rafraîchir la liste si nécessaire
        }
      });
    }

    deleteRequest(id: string): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        this.documentRequestsService.deleteRequest(id).subscribe({
          next: () => {
            this.toastr.success('Offre supprimée avec succès', 'Succès', {
              timeOut: 1500,
              progressBar: true
            });
            this.loadMyRequests();
          },
          error: (err) => {
            this.toastr.error('Erreur lors de la suppression', 'Erreur', {
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
