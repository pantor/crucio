import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from '../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { LearnExamsComponent } from './learn-exams.component';

class AuthStubService {
  getUser() {
    return { };
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ semesters: [], subjects: [] });
  }
}

class CollectionStubService {

}

describe('LearnExamsComponent', () => {
  let component: LearnExamsComponent;
  let fixture: ComponentFixture<LearnExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnExamsComponent, DropdownButtonComponent ],
      imports: [ FormsModule, RouterTestingModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .overrideComponent(LearnExamsComponent, {
      set: {
        providers: [
          { provide: CollectionService, useClass: CollectionStubService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
