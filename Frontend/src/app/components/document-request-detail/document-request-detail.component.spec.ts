import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestDetailComponent } from './document-request-detail.component';

describe('DocumentRequestDetailComponent', () => {
  let component: DocumentRequestDetailComponent;
  let fixture: ComponentFixture<DocumentRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
