import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnExamComponent } from './learn-exam.component';

describe('LearnExamComponent', () => {
  let component: LearnExamComponent;
  let fixture: ComponentFixture<LearnExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
