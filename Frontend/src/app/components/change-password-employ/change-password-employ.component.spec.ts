import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordEmployComponent } from './change-password-employ.component';

describe('ChangePasswordEmployComponent', () => {
  let component: ChangePasswordEmployComponent;
  let fixture: ComponentFixture<ChangePasswordEmployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordEmployComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordEmployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
