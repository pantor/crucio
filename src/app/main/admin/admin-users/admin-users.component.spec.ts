import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { TimeagoComponent } from '../../directives/timeago/timeago.component';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { AdminUsersComponent } from './admin-users.component';

class ApiStubService {
  get(url) {
    return Observable.of({ groups: [], semesters: [] });
  }
}

class AuthStubService {
  getUser() {

  }
}

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUsersComponent, TimeagoComponent, DropdownButtonComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
