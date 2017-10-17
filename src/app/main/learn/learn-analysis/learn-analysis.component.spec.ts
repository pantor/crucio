import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnAnalysisComponent } from './learn-analysis.component';

describe('LearnAnalysisComponent', () => {
  let component: LearnAnalysisComponent;
  let fixture: ComponentFixture<LearnAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
