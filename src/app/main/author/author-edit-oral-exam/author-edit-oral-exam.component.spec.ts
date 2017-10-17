import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorEditOralExamComponent } from './author-edit-oral-exam.component';

describe('AuthorEditOralExamComponent', () => {
  let component: AuthorEditOralExamComponent;
  let fixture: ComponentFixture<AuthorEditOralExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorEditOralExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorEditOralExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
