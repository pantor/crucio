import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDeleteOralExamModalComponent } from './author-delete-oral-exam-modal.component';

describe('AuthorDeleteOralExamModalComponent', () => {
  let component: AuthorDeleteOralExamModalComponent;
  let fixture: ComponentFixture<AuthorDeleteOralExamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorDeleteOralExamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDeleteOralExamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
