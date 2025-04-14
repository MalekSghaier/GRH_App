import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
    'Ingénieur',
    'Master',
    'Doctorat'
  ];

  private searchTerms = new Subject<void>();

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.emitSearch();
    });
  }

  onFieldChange() {
    this.searchTerms.next();
  }

  emitSearch() {
    const cleanedParams: any = {};
    
    if (this.searchParams.duration !== null && this.searchParams.duration !== undefined) {
      cleanedParams.duration = this.searchParams.duration;
    }
    if (this.searchParams.educationLevel.trim()) {
      cleanedParams.educationLevel = this.searchParams.educationLevel.trim();
    }
    if (this.searchParams.requirements.trim()) {
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
    this.emitSearch();
  }
}