import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicationWorkFormComponent } from '../components/application-work-form/application-work-form.component';

@Component({
  selector: 'app-advanced-search-offers-work',
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-search-offers-work.component.html',
  styleUrl: './advanced-search-offers-work.component.css'
})
export class AdvancedSearchOffersWorkComponent implements OnInit{

  @Output() searchCriteria = new EventEmitter<any>();
  private destroy$ = new Subject<void>();
  isJobRequirementsDisabled = false;
  private jobRequirementsTimer: any;



  
  activeOption: 'experienceRequired' | 'educationLevel' | 'jobRequirements' | null = null;
  
  searchParams = {
    experienceRequired: null as number | null,
    educationLevel: '',
    jobRequirements: ''
  };

  educationLevels = [
    'Bac',
    'Bac+2',
    'Bac+3',
    'Licence',
    'Master',
    'Ingénieur',
    'Doctorat'
  ];

  private searchTerms = new Subject<void>();

  ngOnInit() {
    this.searchTerms.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.emitSearch();
    });
  }

  ngOnDestroy() {

    if (this.jobRequirementsTimer) {
      clearTimeout(this.jobRequirementsTimer);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleOption(option: 'experienceRequired' | 'educationLevel' | 'jobRequirements') {
    this.activeOption = this.activeOption === option ? null : option;
  }

  clearField(field: 'experienceRequired' | 'educationLevel' | 'jobRequirements') {
    if (field === 'experienceRequired') {
      this.searchParams.experienceRequired = null;
    } else if (field === 'educationLevel') {
      this.searchParams.educationLevel = '';
    } else {
      this.searchParams.jobRequirements = '';
    }
    this.isJobRequirementsDisabled = false;
    this.onFieldChange();
  }

  onFieldChange() {
    this.isJobRequirementsDisabled = false;
    // Annule le timer précédent s'il existe
    if (this.jobRequirementsTimer) {
      clearTimeout(this.jobRequirementsTimer);
    }
        // Configure un nouveau timer
        this.jobRequirementsTimer = setTimeout(() => {
          this.isJobRequirementsDisabled = true;
          this.searchTerms.next();
        }, 3000); // 3 secondes
    this.searchTerms.next();
  }

  emitSearch() {
    const cleanedParams: any = {};
    
    if (this.searchParams.experienceRequired !== null && this.searchParams.experienceRequired !== undefined) {
      cleanedParams.experienceRequired = this.searchParams.experienceRequired;
    }
    if (this.searchParams.educationLevel?.trim()) {
      cleanedParams.educationLevel = this.searchParams.educationLevel.trim();
    }
    if (this.searchParams.jobRequirements?.trim()) {
      cleanedParams.jobRequirements = this.searchParams.jobRequirements.trim();
    }

    this.searchCriteria.emit(cleanedParams);
  }
  resetForm() {
    localStorage.setItem('showAdvancedSearch', 'true');
  this.searchParams = {
    experienceRequired: null,
    educationLevel: '',
    jobRequirements: ''
  };
  this.searchTerms.next();
  window.location.reload()
  
  }
}
