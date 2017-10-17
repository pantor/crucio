import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnOverviewComponent } from './learn-overview.component';

describe('LearnOverviewComponent', () => {
  let component: LearnOverviewComponent;
  let fixture: ComponentFixture<LearnOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
