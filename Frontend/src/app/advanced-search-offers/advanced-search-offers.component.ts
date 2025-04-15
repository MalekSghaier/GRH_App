import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-advanced-search-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-search-offers.component.html',
  styleUrls: ['./advanced-search-offers.component.css']
})
export class AdvancedSearchOffersComponent implements OnInit {
  @Output() searchCriteria = new EventEmitter<any>();
  private destroy$ = new Subject<void>();
  
  activeOption: 'duration' | 'education' | 'requirements' | null = null;
  
  searchParams = {
    duration: null as number | null,
    educationLevel: '',
    requirements: ''
  };

  educationLevels = [
    'Bac',
    'Bac+2',
    'Bac+3',
    'Licence',
    'Master',
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleOption(option: 'duration' | 'education' | 'requirements') {
    this.activeOption = this.activeOption === option ? null : option;
  }

  clearField(field: 'duration' | 'educationLevel' | 'requirements') {
    if (field === 'duration') {
      this.searchParams.duration = null;
    } else if (field === 'educationLevel') {
      this.searchParams.educationLevel = '';
    } else {
      this.searchParams.requirements = '';
    }
    this.onFieldChange();
  }

  onFieldChange() {
    this.searchTerms.next();
  }

  emitSearch() {
    const cleanedParams: any = {};
    
    if (this.searchParams.duration !== null && this.searchParams.duration !== undefined) {
      cleanedParams.duration = this.searchParams.duration;
    }
    if (this.searchParams.educationLevel?.trim()) {
      cleanedParams.educationLevel = this.searchParams.educationLevel.trim();
    }
    if (this.searchParams.requirements?.trim()) {
      cleanedParams.requirements = this.searchParams.requirements.trim();
    }

    this.searchCriteria.emit(cleanedParams);
  }

  resetForm() {
    this.searchParams = {
      duration: null,
      educationLevel: '',
      requirements: ''
    };
    this.searchTerms.next();
    window.location.reload()
    
  }
}