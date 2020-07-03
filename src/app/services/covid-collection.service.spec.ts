import { TestBed } from '@angular/core/testing';

import { CovidCollectionService } from './covid-collection.service';

describe('CovidCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CovidCollectionService = TestBed.get(CovidCollectionService);
    expect(service).toBeTruthy();
  });
});
