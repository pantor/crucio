import { TestBed, inject } from '@angular/core/testing';
import { Http } from '@angular/http';

import { ApiService } from './api.service';

class HttpStubService {
  get() {}
  put() {}
  post() {}
  delete() {}
}

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: Http, useClass: HttpStubService }
      ]
    });
  });

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});
