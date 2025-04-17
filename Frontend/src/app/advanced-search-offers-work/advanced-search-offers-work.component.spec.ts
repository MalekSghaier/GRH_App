import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchOffersWorkComponent } from './advanced-search-offers-work.component';

describe('AdvancedSearchOffersWorkComponent', () => {
  let component: AdvancedSearchOffersWorkComponent;
  let fixture: ComponentFixture<AdvancedSearchOffersWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSearchOffersWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchOffersWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
