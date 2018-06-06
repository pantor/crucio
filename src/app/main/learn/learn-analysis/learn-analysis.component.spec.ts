import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from '../../services/collection.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { ToastComponent } from '../../directives/toast/toast.component';
import { LearnAnalysisComponent } from './learn-analysis.component';

class AuthStubService {
  getUser() {
    return {};
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ exam: {} });
  }
}

class CollectionStubService {
  getWorkedList() {
    return [];
  }

  loadCombinedListAndQuestions(workedList) {
    return Observable.of([]);
  }

  analyseCombination(list) {
    return {};
  }

  saveResults(list) {

  }

  getType() {
    return 'exam';
  }

  getExamId() {
    return 1;
  }
}

describe('LearnAnalysisComponent', () => {
  let component: LearnAnalysisComponent;
  let fixture: ComponentFixture<LearnAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnAnalysisComponent, ToastComponent ],
      imports: [ RouterTestingModule, NgbModule.forRoot() ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .overrideComponent(LearnAnalysisComponent, {
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
    fixture = TestBed.createComponent(LearnAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
