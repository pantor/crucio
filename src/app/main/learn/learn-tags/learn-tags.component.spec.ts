import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from '../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { DropdownButtonComponent } from '../../directives/dropdown-button/dropdown-button.component';
import { LearnTagsComponent } from './learn-tags.component';

class AuthStubService {
  getUser() {
    return { };
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ tags: [] });
  }
}

class CollectionStubService {

}

describe('LearnTagsComponent', () => {
  let component: LearnTagsComponent;
  let fixture: ComponentFixture<LearnTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnTagsComponent, DropdownButtonComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
      ]
    })
    .overrideComponent(LearnTagsComponent, {
      set: {
        providers: [
          { provide: CollectionService, useClass: CollectionStubService },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
