import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnSubjectsComponent } from './learn-subjects.component';

describe('LearnSubjectsComponent', () => {
  let component: LearnSubjectsComponent;
  let fixture: ComponentFixture<LearnSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
