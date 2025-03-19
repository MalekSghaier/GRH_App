import { Component, AfterViewInit ,ViewEncapsulation,OnInit  } from '@angular/core';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngFor
import { ToastrService } from 'ngx-toastr'; 
import { RouterLink } from '@angular/router'; 
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedNavbarComponent,SharedSidebarComponent,CommonModule,RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class UsersComponent implements AfterViewInit,OnInit  {
  users: any[] = []; 
  isEmpty: boolean = false; 
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  private searchTerms = new Subject<string>();


  constructor(
    private userService: UserService,
    private toastr: ToastrService // Injecter ToastrService pour les notifications

  ) {} // Injecter le service

  ngOnInit(): void {
    this.loadAdminUsers(); // Charger les utilisateurs au démarrage
    
    // Gérer la recherche en temps réel
    this.searchTerms.pipe(
      debounceTime(100),        // Attendre 300ms après chaque frappe
      distinctUntilChanged(),   // Ignorer si le terme de recherche n'a pas changé
      switchMap((query: string) => this.userService.searchUsers(query)) // Changer de recherche
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

    // Charger la liste des utilisateurs
    loadAdminUsers(): void {
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
      this.loadAdminUsers();
    }
  
    getPages(): number[] {
      const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

  // Générer le QR Code pour un utilisateur
  generateQRCode(userId: string): void {
    this.userService.generateQrCode(userId).subscribe({
      next: () => {
        // Afficher une notification de succès
        this.toastr.success('QR Code généré avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur lors de la génération du QR Code:', err);
        this.toastr.error('Erreur lors de la génération du QR Code', 'Erreur');
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé avec succès', 'Succès');
          this.loadAdminUsers(); // Recharger la liste des utilisateurs après la suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', err);
          this.toastr.error('Erreur lors de la suppression de l\'utilisateur', 'Erreur');
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
