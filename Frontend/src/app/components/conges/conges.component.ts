import { Component, ViewEncapsulation,AfterViewInit,OnInit } from '@angular/core';
import { CongesService } from '../../services/conges.service';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngFor

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [SharedSidebarComponent,SharedNavbarComponent,CommonModule],
  templateUrl: './conges.component.html',
  styleUrl: './conges.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation
  
})
export class CongesComponent implements AfterViewInit ,OnInit{
  conges: any[] = [];
  isLoading: boolean = true;
  isEmpty: boolean = false; 
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0

    // Mappage des statuts en français
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
    }
  
    loadConges(): void {
      this.isLoading = true;
      this.congesService.getCompanyCongesPaginated(this.currentPage, this.itemsPerPage)
        .subscribe({
          next: (response) => {
            this.conges = response.data;
            this.totalItems = response.total;
            this.isEmpty = this.conges.length === 0;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des congés:', err);
            this.toastr.error('Erreur lors du chargement des congés', 'Erreur', {
              timeOut: 1500,
              progressBar: true
            });
            this.isEmpty = true;
            this.isLoading = false;
          }
        });
    }

    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadConges();
    }

    updateStatus(id: string, status: 'approved' | 'rejected'): void {
      this.congesService.updateCongeStatus(id, status).subscribe({
        next: (updatedConge) => {
          this.toastr.success('Statut du congé mis à jour', 'Succès', {
            timeOut: 1500,
            progressBar: true
          });
          
          // Supprimer le congé mis à jour du tableau
          this.conges = this.conges.filter(conge => conge._id !== id);
          setTimeout(() => {
            window.location.reload();
          }, 1000); // 1000 millisecondes = 1 seconde
        },
        
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
          this.toastr.error('Erreur lors de la mise à jour du statut', 'Erreur', {
            timeOut: 1500,
            progressBar: true
          });
        }
      });
    }
  // Méthode pour traduire le statut
  translateStatus(status: string): string {
    return this.statusMap[status] || status; // Retourne la traduction ou le statut original si non trouvé
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
