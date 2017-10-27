import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../services/api.service';
import { AuthorSubjectsComponent } from './author-subjects.component';

class ApiStubService {
  get(url, data) {
    return Observable.of({
      subjects: []
    })
  }
}

describe('AuthorSubjectsComponent', () => {
  let component: AuthorSubjectsComponent;
  let fixture: ComponentFixture<AuthorSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorSubjectsComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
