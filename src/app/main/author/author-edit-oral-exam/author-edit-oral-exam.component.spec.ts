import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { ToastComponent } from '../../directives/toast/toast.component';
import { AuthorEditOralExamComponent } from './author-edit-oral-exam.component';

class ApiStubService {
  get(url) {
    return Observable.of({ oral_exam: {} });
  }
}

class AuthStubService {
  getUser() {
    return { };
  }
}

const RouteParams = {
  queryParams: Observable.of({ oralExamId: 1 })
}

describe('AuthorEditOralExamComponent', () => {
  let component: AuthorEditOralExamComponent;
  let fixture: ComponentFixture<AuthorEditOralExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorEditOralExamComponent, ToastComponent ],
      imports: [ FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
        { provide: ActivatedRoute, useValue: RouteParams },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorEditOralExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
