import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { AuthorExamsComponent } from './author-exams.component';

class ApiStubService {
  get(url) {
    return Observable.of({ semesters: [], subjects: [] });
  }
}

class AuthStubService {
  getUser() {
    return {};
  }
}

describe('AuthorExamsComponent', () => {
  let component: AuthorExamsComponent;
  let fixture: ComponentFixture<AuthorExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorExamsComponent, DropdownButtonComponent ],
      imports: [ FormsModule, RouterTestingModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
