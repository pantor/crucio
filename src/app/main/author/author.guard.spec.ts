import { TestBed, async, inject } from '@angular/core/testing';

import { AuthorGuard } from './author.guard';

describe('AuthorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorGuard]
    });
  });

  it('should ...', inject([AuthorGuard], (guard: AuthorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
