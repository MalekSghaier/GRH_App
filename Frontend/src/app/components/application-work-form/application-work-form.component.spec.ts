import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationWorkFormComponent } from './application-work-form.component';

describe('ApplicationWorkFormComponent', () => {
  let component: ApplicationWorkFormComponent;
  let fixture: ComponentFixture<ApplicationWorkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationWorkFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
