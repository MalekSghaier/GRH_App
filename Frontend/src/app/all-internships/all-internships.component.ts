import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternshipOffersService } from '../services/internship-offers.service';
import { TruncatePipe } from '../pipes/truncate.pipe';

@Component({
  selector: 'app-all-internships',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe],
  templateUrl: './all-internships.component.html',
  styleUrls: ['./all-internships.component.css']
})
export class AllInternshipsComponent implements OnInit {
  internshipOffers: any[] = [];
  isLoading = true;

  constructor(private internshipOfferService: InternshipOffersService) {}

  ngOnInit() {
    this.loadAllInternshipOffers();
  }

  loadAllInternshipOffers() {
    this.internshipOfferService.getAllOffers().subscribe({
      next: (offers) => {
        this.internshipOffers = offers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.isLoading = false;
      }
    });
  }
}