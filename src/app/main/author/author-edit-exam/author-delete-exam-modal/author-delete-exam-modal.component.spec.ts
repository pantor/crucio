import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDeleteExamModalComponent } from './author-delete-exam-modal.component';

describe('AuthorDeleteExamModalComponent', () => {
  let component: AuthorDeleteExamModalComponent;
  let fixture: ComponentFixture<AuthorDeleteExamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorDeleteExamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorDeleteExamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
