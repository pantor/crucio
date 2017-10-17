import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnCommentsComponent } from './learn-comments.component';

describe('LearnCommentsComponent', () => {
  let component: LearnCommentsComponent;
  let fixture: ComponentFixture<LearnCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
