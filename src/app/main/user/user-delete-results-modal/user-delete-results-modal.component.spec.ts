import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeleteResultsModalComponent } from './user-delete-results-modal.component';

describe('UserDeleteResultsModalComponent', () => {
  let component: UserDeleteResultsModalComponent;
  let fixture: ComponentFixture<UserDeleteResultsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeleteResultsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteResultsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
