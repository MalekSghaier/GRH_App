// conges-employe.component.ts
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
import { CongesRequestFormComponent } from '../conges-request-form/conges-request-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { ToastrService } from 'ngx-toastr';
import { CongesService } from '../../services/conges.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-conges-employe',
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
  templateUrl: './conges-employe.component.html',
  styleUrl: './conges-employe.component.css',
  encapsulation: ViewEncapsulation.None
  
})
export class CongesEmployeComponent implements  AfterViewInit ,OnInit{

  displayedColumns: string[] = ['startDate', 'endDate', 'reason', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  noDataMessage = "Aucune demande de congé trouvée";
  soldeConges: number = 0;


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private congesService: CongesService,
    private usersService: UserService,
    private  toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadMyConges();
    this.loadSoldeConges();

  }

  loadSoldeConges(): void {
    this.usersService.getMyInfo().subscribe({
      next: (user) => {
        this.soldeConges = user.soldeConges || 0;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du solde', err);
      }
    });
  }

  openAddCongesDialog(): void {
    const dialogRef = this.dialog.open(CongesRequestFormComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMyConges();
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }
  loadMyConges(): void {
    this.congesService.findRequestsByUser().subscribe({
      next: (conges) => {
        this.dataSource.data = conges;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des congés', err);
      }
    });
  }

  deleteConge(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande de congé ?')) {
      this.congesService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Demande supprimée avec succès', 'Succès');
          this.loadMyConges();
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la suppression', 'Erreur');
          console.error(err);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.initializeSidebar();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
