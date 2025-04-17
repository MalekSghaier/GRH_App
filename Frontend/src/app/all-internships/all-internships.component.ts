import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { InternshipOffersService } from '../services/internship-offers.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdvancedSearchOffersComponent } from '../advanced-search-offers/advanced-search-offers.component';
import { ApplicationFormComponent } from '../components/application-form/application-form.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-all-internships',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    TruncatePipe,
    AdvancedSearchOffersComponent
  ],
  templateUrl: './all-internships.component.html',
  styleUrls: ['./all-internships.component.css']
})
export class AllInternshipsComponent implements OnInit, OnDestroy {
  internshipOffers: any[] = [];
  filteredOffers: any[] = [];
  isLoading = true;
  searchText = '';
  showAdvancedSearch = false;
  
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();
  private advancedSearchParams: any = {};

  constructor(
    private internshipOfferService: InternshipOffersService,
    private router: Router,
    private dialog: MatDialog

  ) {}

  ngOnInit() {

      // Vérifier si on doit afficher la recherche avancée
  if (localStorage.getItem('showAdvancedSearch') === 'true') {
    this.showAdvancedSearch = true;
    localStorage.removeItem('showAdvancedSearch'); // Nettoyer
  }
    this.loadAllInternshipOffers();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });

    // Configuration de la recherche texte
    this.searchTerms.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term, this.advancedSearchParams);
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

  onSearchInput(): void {
    // Ajoutez un log pour vérifier ce qui est envoyé
    console.log('Search text:', this.searchText);
    this.searchTerms.next(this.searchText);
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
    if (!this.showAdvancedSearch) {
      this.advancedSearchParams = {};
      this.performSearch(this.searchText, {});
    }
  }

  onAdvancedSearch(params: any) {
    this.advancedSearchParams = params;
    this.performSearch(this.searchText, params);
  }

  private performSearch(text: string, advancedParams: any) {
    this.isLoading = true;
    
    console.log('Performing search with:', {
      text: text,
      advancedParams: advancedParams
    });
  
    this.internshipOfferService.searchPublicOffers(
      text || '', 
      advancedParams.duration,
      advancedParams.educationLevel,
      advancedParams.requirements
    ).subscribe({
      next: (offers) => {
        console.log('Offers found:', offers);
        this.filteredOffers = offers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.isLoading = false;
      }
    });
  }

  openApplicationDialog(offer: any): void {
    const dialogRef = this.dialog.open(ApplicationFormComponent, {
      width: '750px',
      data: { offer: offer },
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optionnel: Rafraîchir les données ou afficher un message
        console.log('Application submitted successfully');
      }
    });
  }
  
}