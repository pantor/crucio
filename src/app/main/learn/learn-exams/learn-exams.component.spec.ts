import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnExamsComponent } from './learn-exams.component';

describe('LearnExamsComponent', () => {
  let component: LearnExamsComponent;
  let fixture: ComponentFixture<LearnExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
