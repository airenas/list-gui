import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FFMpegMp4ExtratorService, Mp4ExtratorService } from './mp4-extrator.service';
import { of } from 'rxjs/internal/observable/of';

describe('FFMpegMp4ExtratorService', () => {
  let service: Mp4ExtratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FFMpegMp4ExtratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

@Injectable()
export class TestMp4ExtratorService implements Mp4ExtratorService {
  extract(file: File): Observable<File> {
    return of(file);
  }
}
