import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { LearnSearchComponent } from './learn-search.component';

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
  learn(type, method, data) {

  }
}

describe('LearnSearchComponent', () => {
  let component: LearnSearchComponent;
  let fixture: ComponentFixture<LearnSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnSearchComponent, DropdownButtonComponent ],
      imports: [ FormsModule, RouterTestingModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
        { provide: CollectionService, useClass: CollectionStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
