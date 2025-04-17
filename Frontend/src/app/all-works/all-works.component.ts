import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApplicationWorkFormComponent } from '../components/application-work-form/application-work-form.component';
import { MatDialog } from '@angular/material/dialog';
import { JobOffersService } from '../services/job-offers.service';
import { AdvancedSearchOffersWorkComponent } from "../advanced-search-offers-work/advanced-search-offers-work.component";

@Component({
  selector: 'app-all-works',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TruncatePipe,
    AdvancedSearchOffersWorkComponent
],
  templateUrl: './all-works.component.html',
  styleUrl: './all-works.component.css'
})
export class AllWorksComponent implements OnInit, OnDestroy {

  workOffers: any[] = [];
  filteredOffers: any[] = [];
  isLoading = true;
  searchText = '';
  showAdvancedSearch = false;
  
  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();
  private advancedSearchParams: any = {};

  constructor(
    private jobOffersService: JobOffersService,
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
    this.jobOffersService.getAllOffers().subscribe({
      next: (offers) => {
        this.workOffers = offers;
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
  
    this.jobOffersService.searchPublicOffers(
      text || '', 
      advancedParams.experienceRequired,
      advancedParams.educationLevel,
      advancedParams.jobRequirements  
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
    const dialogRef = this.dialog.open(ApplicationWorkFormComponent, {
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
