import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PointageService } from '../../services/pointage.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-presence',
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, MatTableModule, MatCardModule],
  templateUrl: './presence.component.html',
  styleUrl: './presence.component.css',
  encapsulation: ViewEncapsulation.None
  
})
export class PresenceComponent implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['nomComplet', 'date', 'entree', 'sortie', 'heuresTravail'];
  dataSource: any[] = [];
  today = new Date().toLocaleDateString();

  constructor(
    private pointageService: PointageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPresence();
  }

    loadPresence(): void {
    this.pointageService.getPresenceAujourdhui().subscribe({
      next: (data) => {
        this.dataSource = data.map(item => ({
          ...item,
          heuresTravail: item.heuresTravail 
            ? item.heuresTravail.toFixed(2) + 'h' 
            : '-'
        }));
      },
      error: (err) => console.error('Erreur chargement présence', err)
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
