import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointageEmployComponent } from './pointage-employ.component';

describe('PointageEmployComponent', () => {
  let component: PointageEmployComponent;
  let fixture: ComponentFixture<PointageEmployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointageEmployComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointageEmployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
