import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../../services/api.service';
import { AdminDeleteUserModalComponent } from './admin-delete-user-modal.component';

class ApiStubService {

}

describe('AdminDeleteUserModalComponent', () => {
  let component: AdminDeleteUserModalComponent;
  let fixture: ComponentFixture<AdminDeleteUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDeleteUserModalComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService},
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleteUserModalComponent);
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
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
