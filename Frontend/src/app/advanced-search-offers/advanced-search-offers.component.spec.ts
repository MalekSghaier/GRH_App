import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchOffersComponent } from './advanced-search-offers.component';

describe('AdvancedSearchOffersComponent', () => {
  let component: AdvancedSearchOffersComponent;
  let fixture: ComponentFixture<AdvancedSearchOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSearchOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
