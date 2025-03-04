import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSuperAdminComponent } from './layout-super-admin.component';

describe('LayoutSuperAdminComponent', () => {
  let component: LayoutSuperAdminComponent;
  let fixture: ComponentFixture<LayoutSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSuperAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
