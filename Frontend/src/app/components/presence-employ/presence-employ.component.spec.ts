import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceEmployComponent } from './presence-employ.component';

describe('PresenceEmployComponent', () => {
  let component: PresenceEmployComponent;
  let fixture: ComponentFixture<PresenceEmployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceEmployComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceEmployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
