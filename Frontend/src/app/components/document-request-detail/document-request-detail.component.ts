import { Component, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { DocumentRequest } from '../../models/document-request.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GmailHelperService } from '../../services/gmail-helper.service';


@Component({
  selector: 'app-document-request-detail',
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, RouterModule],
  templateUrl: './document-request-detail.component.html',
  styleUrls: ['./document-request-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentRequestDetailComponent implements AfterViewInit, OnInit {
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
    private route: ActivatedRoute,
    private documentRequestsService: DocumentRequestsService,
    private gmailHelper: GmailHelperService, 
    private router: Router,
    private toastr: ToastrService,

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (!id) {
      console.error('ID de la demande non trouvé');
      this.router.navigate(['/error']);
      return;
    }
  
    this.documentRequestsService.findRequestById(id).subscribe({
      next: (request) => {
        this.documentRequest = request;
  
        // Mettre à jour le statut si la demande est en attente
        if (request.status === 'En attente') {
          this.documentRequestsService.updateRequestStatus(id, 'En cours de traitement').subscribe({
            next: (updatedRequest) => {
              console.log('Statut mis à jour avec succès', updatedRequest);
              this.documentRequest.status = updatedRequest.status; // Mettre à jour le statut dans le frontend
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour du statut', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la demande', err);
        this.router.navigate(['/error']);
      },
    });
  }

    // Méthode pour rejeter la demande
    rejectRequest(id: string): void {
      if (!id) {
        console.error('ID de la demande non trouvé');
        return;
      }
  
      // Appeler le service pour mettre à jour le statut
      this.documentRequestsService.updateRequestStatus(id, 'Rejetée').subscribe({
        next: (updatedRequest) => {
          console.log('Demande rejetée avec succès', updatedRequest);
          this.toastr.error('Demande rejetée');
          this.documentRequest.status = updatedRequest.status; // Mettre à jour le statut dans le frontend
          setTimeout(() => {
            this.router.navigate(['/document-requests']);
          }, 400);
        },
        error: (err) => {
          console.error('Erreur lors du rejet de la demande', err);
        },
      });
    }


    approveRequest(): void {
      if (!this.documentRequest?._id) return;
    
      // 1. D'abord approuver la demande via l'API
      this.documentRequestsService.approveRequest(this.documentRequest._id).subscribe({
        next: (updatedRequest) => {
          // 2. Mettre à jour le statut localement
          this.documentRequest.status = updatedRequest.status;
          this.toastr.success('Demande approuvée');
    
          // 3. Préparer les données pour Gmail
          const emailData = {
            to: this.documentRequest.professionalEmail,
            subject: `Document approuvé : ${this.documentRequest.documentType}`,
            body: `Bonjour ${this.documentRequest.fullName},\n\n` +
                  `Votre demande de ${this.documentRequest.documentType} a été approuvée.\n\n` +
                  `Cordialement,\nService RH`
          };
    
          // 4. Ouvrir Gmail
          this.gmailHelper.openGmailDraft(emailData);
        },
        error: (err) => {
          this.toastr.error('Échec de l\'approbation');
          console.error(err);
        }
      });
    }


  ngAfterViewInit(): void {
    this.initializeSidebar();
  }

  private initializeSidebar(): void {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

    allSideMenu.forEach((item) => {
      const li = item.parentElement;

      if (li) {
        item.addEventListener('click', function () {
          allSideMenu.forEach((i) => {
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