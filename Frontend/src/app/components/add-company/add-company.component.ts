import { Component, AfterViewInit, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-compagnies',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AddCompanyComponent implements AfterViewInit, OnInit {
  companyForm: FormGroup;
  currentRoute: string = ''; 
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8,10}')]],
      taxId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      logo: [null, Validators.required],
      signature: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // S'abonner aux événements de navigation pour mettre à jour currentRoute
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url; // Mettre à jour currentRoute avec l'URL actuelle
      });
  }
  logout(): void {
    this.authService.logout(); // Appelez la méthode logout
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.companyForm.get(field)?.setValue(file);
    }
  }

  onSubmit() {
    if (this.companyForm.invalid) {
      this.errorMessage = 'Veuillez vérifier vos champs de saisie';
      this.toastr.error('Veuillez vérifier vos champs de saisie', 'Erreur', {
        timeOut: 1500,
        progressBar: true
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.companyForm.get('name')?.value);
    formData.append('address', this.companyForm.get('address')?.value);
    formData.append('phone', this.companyForm.get('phone')?.value);
    formData.append('taxId', this.companyForm.get('taxId')?.value);
    formData.append('email', this.companyForm.get('email')?.value);
    formData.append('password', this.companyForm.get('password')?.value);
    formData.append('logo', this.companyForm.get('logo')?.value);
    formData.append('signature', this.companyForm.get('signature')?.value);

    this.companyService.addCompany(formData).subscribe({
      next: (response) => {
        this.successMessage = " Compagnie ajoutée avec succès.";
        this.errorMessage = '';
        this.toastr.success(this.successMessage, 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
        setTimeout(() => {
        this.router.navigate(['/compagnies']);
        }, 1500);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Une erreur s’est produite lors de l’ajout de la compagnie.';
        }
        this.toastr.error(this.errorMessage, 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
      }
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
      notificationIcon.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        notificationMenu.classList.toggle('show');
        if (profileMenu) {
          profileMenu.classList.remove('show');
        }
      });
    }

    if (profileIcon && profileMenu) {
      profileIcon.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        profileMenu.classList.toggle('show');
        if (notificationMenu) {
          notificationMenu.classList.remove('show');
        }
      });
    }

    document.addEventListener('click', function (e) {
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