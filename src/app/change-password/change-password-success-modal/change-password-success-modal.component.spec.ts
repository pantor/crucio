import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordSuccessModalComponent } from './change-password-success-modal.component';

describe('ChangePasswordSuccessModalComponent', () => {
  let component: ChangePasswordSuccessModalComponent;
  let fixture: ComponentFixture<ChangePasswordSuccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordSuccessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
