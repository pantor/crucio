import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ForgotPasswordSuccessModalComponent } from './forgot-password-success-modal.component';

describe('ForgotPasswordSuccessModalComponent', () => {
  let component: ForgotPasswordSuccessModalComponent;
  let fixture: ComponentFixture<ForgotPasswordSuccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordSuccessModalComponent ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
