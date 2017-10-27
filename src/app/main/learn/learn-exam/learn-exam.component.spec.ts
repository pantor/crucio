import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from '../../services/collection.service';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastComponent } from '../../directives/toast/toast.component';
import { LearnExamComponent } from './learn-exam.component';

class ApiStubService {

}

class AuthStubService {
  getUser() {

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

  getQuestion() {
    return {};
  }
}

describe('LearnExamComponent', () => {
  let component: LearnExamComponent;
  let fixture: ComponentFixture<LearnExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnExamComponent, ToastComponent ],
      imports: [ RouterTestingModule, FormsModule, NgbModule.forRoot() ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
      ]
    })
    .overrideComponent(LearnExamComponent, {
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
    fixture = TestBed.createComponent(LearnExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
