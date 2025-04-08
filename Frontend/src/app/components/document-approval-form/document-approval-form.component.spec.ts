import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentApprovalFormComponent } from './document-approval-form.component';

describe('DocumentApprovalFormComponent', () => {
  let component: DocumentApprovalFormComponent;
  let fixture: ComponentFixture<DocumentApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentApprovalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
