import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInternshipsComponent } from './all-internships.component';

describe('AllInternshipsComponent', () => {
  let component: AllInternshipsComponent;
  let fixture: ComponentFixture<AllInternshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllInternshipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
