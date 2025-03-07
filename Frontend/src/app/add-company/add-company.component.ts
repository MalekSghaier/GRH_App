import { Component, AfterViewInit,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule ,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompanyService } from '../services/company.service'; // Importer le service

@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation
})
export class AddCompanyComponent implements AfterViewInit{
  currentRoute: string = '';

  company: any = {
    name: '',
    address: '',
    phone: '',
    taxId: '',
    email: '',
    password: '',
    logo: null,
    signature: null,
  };
  constructor(private router: Router,
  private companyService: CompanyService) 
  {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }


  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.company[field] = file;
    }
  }

  onSubmit() {

    const formData = new FormData();
    formData.append('name', this.company.name);
    formData.append('address', this.company.address);
    formData.append('phone', this.company.phone);
    formData.append('taxId', this.company.taxId);
    formData.append('email', this.company.email);
    formData.append('password', this.company.password);
    if (this.company.logo) {
      formData.append('logo', this.company.logo);
    }
    if (this.company.signature) {
      formData.append('signature', this.company.signature);
    }

    this.companyService.addCompany(formData).subscribe({
      next: (response) => {
        console.log('✅ Compagnie ajoutée avec succès', response);
        alert('Compagnie ajoutée avec succès !');
        this.router.navigate(['/compagnies']);
      },
      error: (error) => {
        console.error('❌ Erreur lors de l’ajout de la compagnie', error);
        alert(`Erreur : ${error.error?.message || 'Une erreur s’est produite.'}`);
      },
    });
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
