import { Component, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { CongesService } from '../../services/conges.service';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [
    SharedSidebarComponent,
    SharedNavbarComponent,
    CommonModule,
    InitialsPipe
  ],
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CongesComponent implements AfterViewInit, OnInit {
  conges: any[] = [];
  filteredConges: any[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;
  pendingCount: number = 0;
  filter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';

  statusMap: { [key: string]: string } = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté'
  };

  constructor(
    private congesService: CongesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadConges();
    this.loadPendingCount();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  loadConges(): void {
    this.isLoading = true;
    this.congesService.getCompanyCongesPaginated(
      this.currentPage, 
      this.itemsPerPage,
      this.filter === 'all' ? 'pending' : this.filter // Envoyer le filtre actuel
    ).subscribe({
      next: (response) => {
        this.conges = response.data;
        this.totalItems = response.total;
        this.filteredConges = [...this.conges]; // Afficher directement les résultats filtrés
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des congés:', err);
        this.toastr.error('Erreur lors du chargement des congés', 'Erreur');
        this.isLoading = false;
      }
    });
  }

  loadPendingCount(): void {
    this.congesService.countPendingConges().subscribe({
      next: (count) => {
        this.pendingCount = count;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du compteur:', err);
      }
    });
  }

  filterConges(status: 'all' | 'pending' | 'approved' | 'rejected'): void {
    this.filter = status;
    this.currentPage = 1; // Réinitialiser à la première page
    this.loadConges(); // Recharger les données avec le nouveau filtre
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  updateStatus(id: string, status: 'approved' | 'rejected'): void {
    if (confirm(`Êtes-vous sûr de vouloir ${status === 'approved' ? 'approuver' : 'rejeter'} ce congé ?`)) {
      this.congesService.updateCongeStatus(id, status).subscribe({
        next: () => {
          this.toastr.success(`Congé ${status === 'approved' ? 'approuvé' : 'rejeté'}`, 'Succès');
          this.loadConges();
          this.loadPendingCount();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.toastr.error('Erreur lors de la mise à jour', 'Erreur');
        }
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadConges();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadConges();
    }
  }

  translateStatus(status: string): string {
    return this.statusMap[status] || status;
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