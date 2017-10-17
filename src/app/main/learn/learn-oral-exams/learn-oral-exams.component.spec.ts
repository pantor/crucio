import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnOralExamsComponent } from './learn-oral-exams.component';

describe('LearnOralExamsComponent', () => {
  let component: LearnOralExamsComponent;
  let fixture: ComponentFixture<LearnOralExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnOralExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnOralExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
