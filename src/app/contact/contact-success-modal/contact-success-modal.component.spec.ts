import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSuccessModalComponent } from './contact-success-modal.component';

describe('ContactSuccessModalComponent', () => {
  let component: ContactSuccessModalComponent;
  let fixture: ComponentFixture<ContactSuccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactSuccessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
