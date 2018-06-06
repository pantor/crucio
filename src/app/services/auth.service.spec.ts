import { TestBed, inject } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';

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
        { provide: CookieService, useClass: CookieStubService },
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
