import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { LearnOralExamsComponent } from './learn-oral-exams.component';

class AuthStubService {
  getUser() {
    return { };
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ years: [] });
  }
}

describe('LearnOralExamsComponent', () => {
  let component: LearnOralExamsComponent;
  let fixture: ComponentFixture<LearnOralExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnOralExamsComponent, DropdownButtonComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnOralExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
