import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongesRequestFormComponent } from './conges-request-form.component';

describe('CongesRequestFormComponent', () => {
  let component: CongesRequestFormComponent;
  let fixture: ComponentFixture<CongesRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongesRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongesRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
