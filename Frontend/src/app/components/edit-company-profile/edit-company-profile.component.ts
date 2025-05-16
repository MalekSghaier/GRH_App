import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SharedNavbarComponent } from '../shared-navbar/shared-navbar.component';
import { SharedSidebarComponent } from '../shared-sidebar/shared-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-company-profile',
  imports: [SharedNavbarComponent, SharedSidebarComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-company-profile.component.html',
  styleUrl: './edit-company-profile.component.css'
})
export class EditCompanyProfileComponent implements OnInit {
  companyForm: FormGroup;
  company: any;
  currentCompany: any;
  logoFileName: string = '';
  signatureFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8,10}')]],
      taxId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      logo: [null],
      signature: [null],
    });
  }

  ngOnInit(): void {
    this.loadCompanyData();
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.companyForm.get(field)?.setValue(file);
      // Mettre à jour le nom du fichier pour l'affichage
      if (field === 'logo') {
        this.logoFileName = file.name;
      } else if (field === 'signature') {
        this.signatureFileName = file.name;
      }
    }
  }

  loadCompanyData(): void {
    this.companyService.getMyInfo().subscribe({
      next: (data) => {
        this.company = data;
        this.currentCompany = data;
        this.companyForm.patchValue({
          name: data.name,
          address: data.address,
          phone: data.phone,
          taxId: data.taxId,
          email: data.email
        });
        // Initialiser les noms de fichiers si des fichiers existent déjà
        if (data.logo) {
          this.logoFileName = 'Logo actuel';
        }
        if (data.signature) {
          this.signatureFileName = 'Signature actuelle';
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données', err);
        this.toastr.error('Erreur lors du chargement des données', 'Erreur', {
          timeOut: 1500,
          progressBar: true
        });
      }
    });
  }

  onSubmit() {
    if (this.companyForm.invalid) {
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

    // Gestion des fichiers
    const logo = this.companyForm.get('logo')?.value;
    if (logo instanceof File) {
      formData.append('logo', logo, logo.name);
    } else if (this.currentCompany?.logo) {
      formData.append('logo', this.currentCompany.logo);
    }

    const signature = this.companyForm.get('signature')?.value;
    if (signature instanceof File) {
      formData.append('signature', signature, signature.name);
    } else if (this.currentCompany?.signature) {
      formData.append('signature', this.currentCompany.signature);
    }

    this.companyService.updateProfile(formData).subscribe({
      next: (response) => {
        this.toastr.success('Profil mis à jour avec succès', 'Succès', {
          timeOut: 1500,
          progressBar: true
        });
        setTimeout(() => {
          this.router.navigate(['/parametre']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur complète:', error);
        this.toastr.error(
          error.message || 'Une erreur est survenue lors de la mise à jour',
          'Erreur',
          { 
            timeOut: 3000,
            progressBar: true,
            enableHtml: true
          }
        );
        
        if (error.details) {
          console.error('Détails de l\'erreur:', error.details);
        }
      }
    });
  }
}