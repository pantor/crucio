import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserModalComponent } from './admin-user-modal.component';

describe('AdminUserModalComponent', () => {
  let component: AdminUserModalComponent;
  let fixture: ComponentFixture<AdminUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
