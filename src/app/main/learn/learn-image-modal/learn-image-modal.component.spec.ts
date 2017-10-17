import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnImageModalComponent } from './learn-image-modal.component';

describe('LearnImageModalComponent', () => {
  let component: LearnImageModalComponent;
  let fixture: ComponentFixture<LearnImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnImageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
