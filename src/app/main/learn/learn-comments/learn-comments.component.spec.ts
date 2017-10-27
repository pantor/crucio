import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { TimeagoComponent } from '../../directives/timeago/timeago.component';
import { LearnCommentsComponent } from './learn-comments.component';

class AuthStubService {
  getUser() {
    return { group_id: 2 };
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ comments: [] });
  }
}

describe('LearnCommentsComponent', () => {
  let component: LearnCommentsComponent;
  let fixture: ComponentFixture<LearnCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnCommentsComponent, TimeagoComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
      ]
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
