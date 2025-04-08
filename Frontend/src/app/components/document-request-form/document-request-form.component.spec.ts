import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestFormComponent } from './document-request-form.component';

describe('DocumentRequestFormComponent', () => {
  let component: DocumentRequestFormComponent;
  let fixture: ComponentFixture<DocumentRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
