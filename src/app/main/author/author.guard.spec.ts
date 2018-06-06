import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../services/auth.service';
import { AuthorGuard } from './author.guard';

class AuthStubService {
  getUser() {
    return { group_id: 2 };
  }
}

describe('AuthorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        AuthorGuard,
        { provide: AuthService, useClass: AuthStubService },
      ]
    });
  });

  it('should ...', inject([AuthorGuard], (guard: AuthorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
