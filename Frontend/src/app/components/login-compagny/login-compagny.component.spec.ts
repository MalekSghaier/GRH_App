import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCompagnyComponent } from './login-compagny.component';

describe('LoginCompagnyComponent', () => {
  let component: LoginCompagnyComponent;
  let fixture: ComponentFixture<LoginCompagnyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCompagnyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCompagnyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
