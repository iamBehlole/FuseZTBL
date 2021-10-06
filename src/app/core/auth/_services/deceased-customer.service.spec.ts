import { TestBed } from '@angular/core/testing';

import { DeceasedCustomerService } from './deceased-customer.service';

describe('DeceasedCustomerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeceasedCustomerService = TestBed.get(DeceasedCustomerService);
    expect(service).toBeTruthy();
  });
});
