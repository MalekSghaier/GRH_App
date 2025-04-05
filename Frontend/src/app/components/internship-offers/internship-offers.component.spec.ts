import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipOffersComponent } from './internship-offers.component';

describe('InternshipOffersComponent', () => {
  let component: InternshipOffersComponent;
  let fixture: ComponentFixture<InternshipOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
