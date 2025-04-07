import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestEmployeComponent } from './document-request-employe.component';

describe('DocumentRequestEmployeComponent', () => {
  let component: DocumentRequestEmployeComponent;
  let fixture: ComponentFixture<DocumentRequestEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequestEmployeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequestEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
