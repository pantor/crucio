import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnSearchComponent } from './learn-search.component';

describe('LearnSearchComponent', () => {
  let component: LearnSearchComponent;
  let fixture: ComponentFixture<LearnSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
