import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../directives/toast/toast.component';
import { AuthorEditExamComponent } from './author-edit-exam.component';

class ApiStubService {
  get(url) {
    if (url === 'subjects') {
      return Observable.of({ subjects: [] });
    } else {
      return Observable.of({ exam: {}, questions: [] });
    }
  }
}

class AuthStubService {
  getUser() {

  }
}

const RouteParams = {
  queryParams: Observable.of({ examId: 1, openQuestionId: 0 })
}

describe('AuthorEditExamComponent', () => {
  let component: AuthorEditExamComponent;
  let fixture: ComponentFixture<AuthorEditExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorEditExamComponent, ToastComponent ],
      imports: [ FormsModule, QuillModule, NgbModule.forRoot() ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
        { provide: ActivatedRoute, useValue: RouteParams },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorEditExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
