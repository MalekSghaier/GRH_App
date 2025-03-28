import { Component,ViewEncapsulation,AfterViewInit, OnInit } from '@angular/core';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { DocumentRequest } from '../../models/document-request.model';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-document-requests-list',
  imports: [SharedNavbarComponent,SharedSidebarComponent,CommonModule,RouterModule],
  templateUrl: './document-requests-list.component.html',
  styleUrl: './document-requests-list.component.css',
  encapsulation: ViewEncapsulation.None 

})
export class DocumentRequestsListComponent implements AfterViewInit, OnInit {

  documentRequests: DocumentRequest[] = [];

  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  constructor(private documentRequestsService: DocumentRequestsService,    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDocumentRequests();
  }

  private loadDocumentRequests(): void {
    this.isLoading = true;
    this.documentRequestsService.getCompanyDocumentRequestsPaginated(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.documentRequests = response.data;
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
