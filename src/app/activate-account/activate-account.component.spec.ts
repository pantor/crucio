import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApiService } from '../services/api.service';
import { ActivateAccountComponent } from './activate-account.component';

class ApiStubService {
  put(url, data) {
    return of({ error: '' });
  }
}

const RouteParams = {
  queryParams: of({token: 'asdfb'})
};

describe('ActivateAccountComponent', () => {
  let component: ActivateAccountComponent;
  let fixture: ComponentFixture<ActivateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateAccountComponent ],
      providers: [
        { provide: ApiService, useClass: ApiStubService },
        { provide: ActivatedRoute, useValue: RouteParams }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
