import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorEditExamComponent } from './author-edit-exam.component';

describe('AuthorEditExamComponent', () => {
  let component: AuthorEditExamComponent;
  let fixture: ComponentFixture<AuthorEditExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorEditExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorEditExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
