import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { Observable } from 'rxjs/Observable';

import { ToastService } from '../../services/toast.service';
import { CollectionService } from '../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { TimeagoComponent } from '../../directives/timeago/timeago.component';
import { ToastComponent } from '../../directives/toast/toast.component';
import { LearnQuestionComponent } from './learn-question.component';

class AuthStubService {
  getUser() {
    return { group_id: 2 };
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ question: {}, comments: [], tags: '' });
  }
}

class CollectionStubService {
  getList() {
    return [];
  }

  loadCombinedListAndQuestions(workedList) {
    return Observable.of([]);
  }

  getLength() {
    return 0;
  }

  getIndexOfQuestion(question) {
    return 0;
  }

  getQuestionData(index) {
    return {};
  }

  deleteLocal() {

  }
}

describe('LearnQuestionComponent', () => {
  let component: LearnQuestionComponent;
  let fixture: ComponentFixture<LearnQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnQuestionComponent, TimeagoComponent, ToastComponent ],
      imports: [ FormsModule, NgbModule.forRoot(), RouterTestingModule, TagInputModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
        CollectionService,
      ]
    })
    .overrideComponent(LearnQuestionComponent, {
      set: {
        providers: [
          ToastService,
          { provide: CollectionService, useClass: CollectionStubService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
