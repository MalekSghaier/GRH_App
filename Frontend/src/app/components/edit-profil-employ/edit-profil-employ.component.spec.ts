import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilEmployComponent } from './edit-profil-employ.component';

describe('EditProfilEmployComponent', () => {
  let component: EditProfilEmployComponent;
  let fixture: ComponentFixture<EditProfilEmployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfilEmployComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfilEmployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
