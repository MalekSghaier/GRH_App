import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipOfferFormComponent } from './internship-offer-form.component';

describe('InternshipOfferFormComponent', () => {
  let component: InternshipOfferFormComponent;
  let fixture: ComponentFixture<InternshipOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipOfferFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
