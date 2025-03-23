import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestsListComponent } from './document-requests-list.component';

describe('DocumentRequestsListComponent', () => {
  let component: DocumentRequestsListComponent;
  let fixture: ComponentFixture<DocumentRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequestsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
