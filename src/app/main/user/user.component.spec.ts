import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../directives/toast/toast.component';
import { UserComponent } from './user.component';

class ApiStubService {
  put(url, data) {

  }
}

class AuthStubService {
  getUser() {
    return {
      user_id: 1,
      course_id: 1,
      semester: 1,
      showComments: true,
    }
  }

  setUser(user) {

  }
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserComponent, ToastComponent ],
      imports: [ FormsModule, ReactiveFormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
