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
import { ToastrModule } from 'ngx-toastr'; 
import { MatDialog } from '@angular/material/dialog';
import { DocumentApprovalFormComponent } from '../document-approval-form/document-approval-form.component';
import { InitialsPipe } from '../../pipes/initials.pipe';



@Component({
  selector: 'app-document-request-detail',
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, RouterModule,ToastrModule,InitialsPipe],
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
    private dialog: MatDialog


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
          this.toastr.success('Demande rejetée','Erreur', {
            timeOut: 1500,
            progressBar: true
          });
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
    
      const dialogRef = this.dialog.open(DocumentApprovalFormComponent, {
        width: '400px',
        height: 'auto', // ou une hauteur fixe comme '600px'
        maxHeight: 'none', // Désactive la hauteur maximale
        panelClass: 'custom-dialog', // Classe CSS personnalisée (optionnelle)
                data: {
          requestId: this.documentRequest._id,
          requestData: this.documentRequest
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.toastr.success('Demande approuvée et document envoyé', 'Succès');
          setTimeout(() => {
            this.router.navigate(['/document-requests']);
          }, 1500);
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