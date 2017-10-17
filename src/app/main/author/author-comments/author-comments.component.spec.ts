import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorCommentsComponent } from './author-comments.component';

describe('AuthorCommentsComponent', () => {
  let component: AuthorCommentsComponent;
  let fixture: ComponentFixture<AuthorCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
