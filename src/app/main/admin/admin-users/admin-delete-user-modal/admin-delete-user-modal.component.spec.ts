import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteUserModalComponent } from './admin-delete-user-modal.component';

describe('AdminDeleteUserModalComponent', () => {
  let component: AdminDeleteUserModalComponent;
  let fixture: ComponentFixture<AdminDeleteUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDeleteUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleteUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
