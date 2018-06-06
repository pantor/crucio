import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CollectionService } from './collection.service';

class AuthStubService {
  getUser() {
    return { group_id: 2 };
  }
}

class ApiStubService {

}

describe('CollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        CollectionService,
        { provide: ApiService, useClass: ApiStubService },
        { provide: AuthService, useClass: AuthStubService },
      ]
    });
  });

  it('should be created', inject([CollectionService], (service: CollectionService) => {
    expect(service).toBeTruthy();
  }));
});
