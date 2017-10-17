import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnReportModalComponent } from './learn-report-modal.component';

describe('LearnReportModalComponent', () => {
  let component: LearnReportModalComponent;
  let fixture: ComponentFixture<LearnReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnReportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
