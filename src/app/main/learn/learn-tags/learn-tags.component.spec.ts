import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnTagsComponent } from './learn-tags.component';

describe('LearnTagsComponent', () => {
  let component: LearnTagsComponent;
  let fixture: ComponentFixture<LearnTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
