import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEmployComponent } from './profil-employ.component';

describe('ProfilEmployComponent', () => {
  let component: ProfilEmployComponent;
  let fixture: ComponentFixture<ProfilEmployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilEmployComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilEmployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
