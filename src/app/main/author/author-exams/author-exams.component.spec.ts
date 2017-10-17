import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorExamsComponent } from './author-exams.component';

describe('AuthorExamsComponent', () => {
  let component: AuthorExamsComponent;
  let fixture: ComponentFixture<AuthorExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
