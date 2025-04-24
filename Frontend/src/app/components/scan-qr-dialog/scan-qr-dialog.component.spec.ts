import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanQrDialogComponent } from './scan-qr-dialog.component';

describe('ScanQrDialogComponent', () => {
  let component: ScanQrDialogComponent;
  let fixture: ComponentFixture<ScanQrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanQrDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanQrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
