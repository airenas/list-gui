import { TestBed } from '@angular/core/testing';

import { Mp4ExtratorService } from './mp4-extrator.service';

describe('Mp4ExtratorService', () => {
  let service: Mp4ExtratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mp4ExtratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
