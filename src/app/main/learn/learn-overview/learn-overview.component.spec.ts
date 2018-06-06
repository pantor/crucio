import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { CollectionService } from './../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { LearnOverviewComponent } from './learn-overview.component';

class AuthStubService {
  getUser() {
    return { };
  }
}

class ApiStubService {
  get(url, data) {
    return Observable.of({ collections: [] });
  }
}

class CollectionStubService {

}

describe('LearnOverviewComponent', () => {
  let component: LearnOverviewComponent;
  let fixture: ComponentFixture<LearnOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnOverviewComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ApiService, useClass: ApiStubService },
        { provide: CollectionService, useClass: CollectionStubService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
