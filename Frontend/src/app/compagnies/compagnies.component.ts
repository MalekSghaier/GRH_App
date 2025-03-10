import { Component, AfterViewInit,ViewEncapsulation ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule ,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CompanyService } from '../services/company.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';


@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compagnies.component.html',
  styleUrl: './compagnies.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation

})
export class CompagniesComponent implements AfterViewInit,OnInit {
  currentRoute: string = '';
  companies: any[] = [];
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'éléments par page
  totalItems: number = 0; // Nombre total d'éléments
  searchQuery: string = '';
  searchSubject = new Subject<string>();
  isEmpty: boolean = false; // Nouvelle variable pour gérer l'état vide


  constructor(
    private router: Router,
    private companyService: CompanyService
  ) 
  
  {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  ngOnInit(): void {
    this.loadCompanies();

    this.searchSubject.pipe(
      debounceTime(300), // Attendre 300ms après la dernière frappe
      distinctUntilChanged() // Ne pas appeler si la valeur n'a pas changé
    ).subscribe(query => {
      this.searchCompanies(query);
    });
  }

  loadCompanies(): void {
    this.companyService.getCompanies(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.companies = response.data; // Mettre à jour la liste des compagnies
        this.totalItems = response.total; // Mettre à jour le nombre total d'éléments
        this.isEmpty = this.companies.length === 0; // Vérifier si le tableau est vide

      },
      error: (err) => {
        console.error('Erreur lors du chargement des compagnies:', err);
        this.isEmpty = true; // En cas d'erreur, considérer le tableau comme vide

      },
    });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  searchCompanies(query: string): void {
    if (query) {
      this.companyService.searchCompanies(query).subscribe({
        next: (companies) => {
          this.companies = companies;
          this.isEmpty = this.companies.length === 0; // Vérifier si le tableau est vide

        },
        error: (err) => {
          console.error('Erreur lors de la recherche des compagnies:', err);
          this.isEmpty = true; // En cas d'erreur, considérer le tableau comme vide

        },
      });
    } else {
      this.loadCompanies(); // Recharger toutes les compagnies si la recherche est vide
    }
  }

  // Changer de page
  onPageChange(page: number): void {
    this.currentPage = page; // Mettre à jour la page actuelle
    this.loadCompanies(); // Recharger les compagnies pour la nouvelle page
  }

  // Générer un tableau de numéros de page pour la pagination
  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculer le nombre total de pages
    return Array.from({ length: totalPages }, (_, i) => i + 1); // Générer un tableau [1, 2, 3, ...]
  }



  editCompany(company: any): void {
    this.router.navigate(['/edit-company', company._id]); // Redirige vers la page d'édition
  }
  
  deleteCompany(companyId: string): void {
    // Afficher une boîte de dialogue de confirmation
    if (confirm('Voulez-vous vraiment supprimer cette compagnie ?')) {
      // Appeler le service pour supprimer la compagnie
      this.companyService.deleteCompany(companyId).subscribe({
        next: () => {
          // Supprimer la compagnie de la liste locale
          this.companies = this.companies.filter(c => c._id !== companyId);
  
          this.currentPage = 1; // Rediriger vers la première page

          // Recharger les compagnies pour mettre à jour la pagination
          this.loadCompanies();
  
          // Afficher un message de succès (optionnel)
          console.log('Compagnie supprimée avec succès');


        },
        error: (err) => {
          // Afficher une erreur en cas de problème
          console.error('Erreur lors de la suppression:', err);
        },
      });
    }
  }
  

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeSearch();
    this.initializeDarkMode();
    this.initializeMenus();
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

  
  private initializeSearch(): void {
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (searchButton && searchButtonIcon && searchForm) {
      searchButton.addEventListener('click', function (e) {
        if (window.innerWidth < 768) {
          e.preventDefault();
          searchForm.classList.toggle('show');
          if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
          } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
          }
        }
      });
    }
  }

  private initializeDarkMode(): void {
    const switchMode = document.getElementById('switch-mode') as HTMLInputElement | null;

    if (switchMode) {
      switchMode.addEventListener('change', function () {
        if (this.checked) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });
    }
  }

  private initializeMenus(): void {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationMenu = document.getElementById('notificationMenu');
    const profileIcon = document.getElementById('profileIcon');
    const profileMenu = document.getElementById('profileMenu');

    if (notificationIcon && notificationMenu) {
        notificationIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }
        });
    }

    if (profileIcon && profileMenu) {
        profileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            profileMenu.classList.toggle('show');
            if (notificationMenu) {
                notificationMenu.classList.remove('show');
            }
        });
    }

    // Fermeture des menus lors du clic ailleurs
    document.addEventListener('click', function(e) {
        const target = e.target as HTMLElement;
        if (notificationMenu && profileMenu) {
            if (!target.closest('#notificationIcon') && !target.closest('#profileMenu')) {
                notificationMenu.classList.remove('show');
            }
            if (!target.closest('#profileIcon') && !target.closest('#profileMenu')) {
                profileMenu.classList.remove('show');
            }
        }
    });
}
}
