import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../services/auth.service';
import { MainGuard } from './main.guard';

class AuthStubService {
  isLoggedIn() {
    return true;
  }
}

describe('MainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        MainGuard,
        { provide: AuthService, useClass: AuthStubService },
      ]
    });
  });

  it('should ...', inject([MainGuard], (guard: MainGuard) => {
    expect(guard).toBeTruthy();
  }));
});
