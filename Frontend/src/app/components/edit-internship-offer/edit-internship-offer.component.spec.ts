import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInternshipOfferComponent } from './edit-internship-offer.component';

describe('EditInternshipOfferComponent', () => {
  let component: EditInternshipOfferComponent;
  let fixture: ComponentFixture<EditInternshipOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInternshipOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInternshipOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
