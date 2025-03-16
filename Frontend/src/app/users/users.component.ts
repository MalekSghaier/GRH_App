import { Component, AfterViewInit ,ViewEncapsulation } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedNavbarComponent,SharedSidebarComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class UsersComponent implements AfterViewInit {

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
