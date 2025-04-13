import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InternshipOffersService } from '../services/internship-offers.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(
    private internshipOfferService: InternshipOffersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllInternshipOffers();
    
    // Solution 1: Scroller vers le haut lors de la navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  loadAllInternshipOffers() {
    this.internshipOfferService.getAllOffers().subscribe({
      next: (offers) => {
        this.internshipOffers = offers;
        this.isLoading = false;
        // Solution alternative: Scroller après le chargement
        setTimeout(() => window.scrollTo(0, 0), 0);
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.isLoading = false;
      }
    });
  }
}