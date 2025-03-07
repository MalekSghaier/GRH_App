import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CompanyService } from '../services/company.service'; // Importer le service

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Ajouter HttpClientModule ici
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'], // Correction ici (styleUrl → styleUrls)
})
export class AddCompanyComponent {
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

  constructor(
    private router: Router,
    private companyService: CompanyService,
  ) {}

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
}
