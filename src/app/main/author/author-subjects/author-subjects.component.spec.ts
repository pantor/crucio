import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorSubjectsComponent } from './author-subjects.component';

describe('AuthorSubjectsComponent', () => {
  let component: AuthorSubjectsComponent;
  let fixture: ComponentFixture<AuthorSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
