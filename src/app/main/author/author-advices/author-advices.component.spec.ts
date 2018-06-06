import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorAdvicesComponent } from './author-advices.component';

describe('AuthorAdvicesComponent', () => {
  let component: AuthorAdvicesComponent;
  let fixture: ComponentFixture<AuthorAdvicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorAdvicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorAdvicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
