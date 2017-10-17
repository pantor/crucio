import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnQuestionComponent } from './learn-question.component';

describe('LearnQuestionComponent', () => {
  let component: LearnQuestionComponent;
  let fixture: ComponentFixture<LearnQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
