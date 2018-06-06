import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../services/api.service';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { AuthorOralExamsComponent } from './author-oral-exams.component';

class ApiStubService {
  get(url) {
    return Observable.of({ years: [] });
  }
}

describe('AuthorOralExamsComponent', () => {
  let component: AuthorOralExamsComponent;
  let fixture: ComponentFixture<AuthorOralExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorOralExamsComponent, DropdownButtonComponent ],
      imports: [ FormsModule, RouterTestingModule ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorOralExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
