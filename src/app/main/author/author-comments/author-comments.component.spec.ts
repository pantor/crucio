import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { TimeagoComponent } from '../../directives/timeago/timeago.component';
import { ToastComponent } from '../../directives/toast/toast.component';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { AuthorCommentsComponent } from './author-comments.component';

class ApiStubService {
  get(url) {
    return of({ comments: [] });
  }
}

class AuthStubService {
  getUser() {
    return { };
  }
}

describe('AuthorCommentsComponent', () => {
  let component: AuthorCommentsComponent;
  let fixture: ComponentFixture<AuthorCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorCommentsComponent, TimeagoComponent, ToastComponent, DropdownButtonComponent ],
      imports: [ FormsModule, RouterTestingModule, NgbModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
