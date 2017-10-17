import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeleteTagsModalComponent } from './user-delete-tags-modal.component';

describe('UserDeleteTagsModalComponent', () => {
  let component: UserDeleteTagsModalComponent;
  let fixture: ComponentFixture<UserDeleteTagsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeleteTagsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteTagsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
