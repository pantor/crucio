import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWhitelistComponent } from './admin-whitelist.component';

describe('AdminWhitelistComponent', () => {
  let component: AdminWhitelistComponent;
  let fixture: ComponentFixture<AdminWhitelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminWhitelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
