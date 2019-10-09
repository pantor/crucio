import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { UserDeleteUserModalComponent } from './user-delete-user-modal.component';

class ApiStubService {

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

describe('UserDeleteUserModalComponent', () => {
  let component: UserDeleteUserModalComponent;
  let fixture: ComponentFixture<UserDeleteUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeleteUserModalComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeleteUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
