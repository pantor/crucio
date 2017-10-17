import { TestBed, async, inject } from '@angular/core/testing';

import { MainGuard } from './main.guard';

describe('MainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainGuard]
    });
  });

  it('should ...', inject([MainGuard], (guard: MainGuard) => {
    expect(guard).toBeTruthy();
  }));
});
