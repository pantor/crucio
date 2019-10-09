import { TestBed, inject } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';

import { ApiService } from '../services/api.service';
import { AuthService } from './auth.service';

class ApiStubService {
  put(url, data) {

  }
}

class CookieStubService {
  getObject(key) {

  }

  putObject(key, object) {

  }

  remove() {

  }
}

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        AuthService,
        { provide: ApiService, useClass: ApiStubService },
        { provide: CookieService, useClass: CookieStubService },
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
