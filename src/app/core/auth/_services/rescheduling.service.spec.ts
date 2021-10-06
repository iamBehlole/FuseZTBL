import { TestBed } from '@angular/core/testing';

import { ReschedulingService } from './rescheduling.service';

describe('ReschedulingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReschedulingService = TestBed.get(ReschedulingService);
    expect(service).toBeTruthy();
  });
});
