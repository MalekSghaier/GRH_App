import { Component,ViewEncapsulation,AfterViewInit, OnInit } from '@angular/core';
import { DocumentRequestsService } from '../../services/document-requests.service';
import { DocumentRequest } from '../../models/document-request.model';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';


@Component({
  selector: 'app-document-requests-list',
  imports: [SharedNavbarComponent,SharedSidebarComponent,CommonModule,RouterModule],
  templateUrl: './document-requests-list.component.html',
  styleUrl: './document-requests-list.component.css',
  encapsulation: ViewEncapsulation.None 

})
export class DocumentRequestsListComponent implements AfterViewInit, OnInit {

  documentRequests: DocumentRequest[] = [];

  constructor(private documentRequestsService: DocumentRequestsService) {}

  ngOnInit(): void {
    this.loadDocumentRequests();

    
  }

  private loadDocumentRequests(): void {
    this.documentRequestsService.findAllRequests().subscribe(requests => {
      // Filtrer les demandes dont l'état est "En attente" ou "En cours de traitement"
      this.documentRequests = requests.filter(request => 
        request.status === 'En attente' || request.status === 'En cours de traitement'
      );
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
