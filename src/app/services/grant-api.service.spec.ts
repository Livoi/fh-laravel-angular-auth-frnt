import { TestBed } from '@angular/core/testing';

import { GrantApiService } from './grant-api.service';

describe('GrantApiService', () => {
  let service: GrantApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrantApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
