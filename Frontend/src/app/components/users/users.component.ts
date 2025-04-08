import { Component, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 
import { RouterLink } from '@angular/router'; 
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements AfterViewInit, OnInit {
  users: any[] = []; 
  isEmpty: boolean = false; 
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  private searchTerms = new Subject<string>();
  private currentCompanyName: string | null = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentCompanyName = localStorage.getItem('companyName');
    this.loadUsers();
    
    this.searchTerms.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (this.currentCompanyName) {
          return this.userService.searchUsers(query).pipe(
            map(users => users.filter(user => user.company === this.currentCompanyName))
          );
        } else {
          return this.userService.searchUsers(query);
        }
      })
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.isEmpty = users.length === 0;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche des utilisateurs:', err);
        this.isEmpty = true;
      }
    });
  }

  search(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    this.searchTerms.next(query);
  }

  loadUsers(): void {
    if (this.currentCompanyName) {
      this.loadCompanyUsers(this.currentCompanyName);
    } else {
      this.loadAllUsers();
    }
  }

  loadCompanyUsers(companyName: string): void {
    this.userService.getUsersByCompanyPaginated(companyName, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalItems = response.total;
        this.isEmpty = this.users.length === 0;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.isEmpty = true;
      },
    });
  }

  loadAllUsers(): void {
    this.userService.getPaginatedAdminUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalItems = response.total;
        this.isEmpty = this.users.length === 0;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        this.isEmpty = true;
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  generateQRCode(userId: string, userName: string): void {
    this.userService.generateQrCode(userId).subscribe({
      next: (response) => {
        const filename = `QRCode_${userName}_${new Date().toISOString().slice(0, 10)}.png`;
        this.userService.downloadQRCode(response.qrCode, filename);
        this.toastr.success('QR Code téléchargé avec succès', 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
      },
      error: (err) => {
        console.error('Erreur lors de la génération du QR Code:', err);
        this.toastr.error('Erreur lors de la génération du QR Code', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé avec succès', 'Succès', {
            timeOut: 1500,
            progressBar: true
          });
          
          // Solution alternative: recharger toujours depuis la première page
          this.currentPage = 1;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', err);
          this.toastr.error('Erreur lors de la suppression de l\'utilisateur', 'Erreur', {
            timeOut: 1500,
            progressBar: true
          });
        }
      });
    }
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