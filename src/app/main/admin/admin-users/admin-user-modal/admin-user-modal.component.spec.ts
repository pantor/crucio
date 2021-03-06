import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { ApiService } from '../../../../services/api.service';
import { TimeagoComponent } from '../../../directives/timeago/timeago.component';
import { AdminUserModalComponent } from './admin-user-modal.component';

class ApiStubService {
  get(url, data) {
    return of({ groups: [] });
  }
}

describe('AdminUserModalComponent', () => {
  let component: AdminUserModalComponent;
  let fixture: ComponentFixture<AdminUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserModalComponent, TimeagoComponent ],
      imports: [ FormsModule, NgbModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        NgbActiveModal,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserModalComponent);
    component = fixture.componentInstance;
    component.user = {
      user_id: 1,
      username: 'Test',
      active: 1,
      course_id: 0,
      email: 'test@gmail.com',
      group_id: 2,
      last_sign_in: 123,
      sign_up_date: 123,
      LostpasswordRequest: 0,
      password: 'hash',
      remember_me: '1',
      semester: 1,
      highlightExams: 0,
      showComments: 1,
      useAnswers: 0,
      useTags: 0,
      jwt: '',
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
