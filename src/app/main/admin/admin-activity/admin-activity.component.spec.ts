import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivityComponent } from './admin-activity.component';

describe('AdminActivityComponent', () => {
  let component: AdminActivityComponent;
  let fixture: ComponentFixture<AdminActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
