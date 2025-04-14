import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { InternshipOffersService } from '../services/internship-offers.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchFilterPipe } from '../search-filter.pipe';

@Component({
  selector: 'app-all-internships',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TruncatePipe,
    FormsModule,
    SearchFilterPipe
  ],
  templateUrl: './all-internships.component.html',
  styleUrls: ['./all-internships.component.css']
})
export class AllInternshipsComponent implements OnInit, OnDestroy {
  internshipOffers: any[] = [];
  filteredOffers: any[] = [];
  isLoading = true;
  searchText = '';
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private internshipOfferService: InternshipOffersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllInternshipOffers();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });

    // Configuration de la recherche en temps réel avec délai
    this.searchTerms.pipe(
      takeUntil(this.destroy$),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 3) {
          return this.internshipOfferService.searchPublicOffers(term);
        } else {
          return this.internshipOfferService.getAllPublicOffers();
        }
      })
    ).subscribe(offers => {
      this.filteredOffers = offers;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllInternshipOffers() {
    this.internshipOfferService.getAllPublicOffers().subscribe({
      next: (offers) => {
        this.internshipOffers = offers;
        this.filteredOffers = [...offers];
        this.isLoading = false;
        setTimeout(() => window.scrollTo(0, 0), 0);
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.isLoading = false;
      }
    });
  }

  // Déclenché à chaque frappe au clavier
  onSearchInput(): void {
    this.searchTerms.next(this.searchText);
  }

  openAdvancedSearch() {
    // Implémenter l'ouverture d'un modal ou redirection
    console.log('Advanced search clicked');
  }
}