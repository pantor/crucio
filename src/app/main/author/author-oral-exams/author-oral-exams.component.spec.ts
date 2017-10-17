import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorOralExamsComponent } from './author-oral-exams.component';

describe('AuthorOralExamsComponent', () => {
  let component: AuthorOralExamsComponent;
  let fixture: ComponentFixture<AuthorOralExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorOralExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorOralExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
