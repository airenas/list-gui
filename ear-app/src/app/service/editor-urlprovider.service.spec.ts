import { TestBed, inject } from '@angular/core/testing';

import { TestAppModule } from '../base/test.app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Config } from '../config';
import { EditorURLProviderService } from './editor-urlprovider.service';

describe('EditorURLProviderService', () => {
  let location: URL;
  let config: Config;

  beforeEach(() => {
    config = new Config();
    TestBed.configureTestingModule({
      providers: [EditorURLProviderService,
        { provide: Config, useValue: config }
      ],
      imports: [TestAppModule, RouterTestingModule.withRoutes([])]
    });
    location = new URL('http://host:8000/');
  });

  it('should be created', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    expect(service).toBeTruthy();
  }));

  it('should use url from config', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'result/id/lattice/lat.txt'))
      .toContain('http://host:8000/olia/');
  }));

  it('should strip router path', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'result/id/lattice/lat.txt'))
      .toContain('http://host:8000/lala/olia/');
  }));

  it('should add audio param', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'result/id/lattice/lat.txt'))
      .toContain('/' + encodeURIComponent('http://host:8000/lala/audio/id'));
  }));

  it('should add audio param', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'result/id/lattice/lat.txt'))
      .toContain('/' + encodeURIComponent('http://host:8000/lala/audio/id'));
  }));

  it('should add lattice param', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'result/id/lattice/lat.txt'))
      .toContain('/' + encodeURIComponent('http://host:8000/lala/result/id/lattice/lat.txt') + '/');
  }));

  it('should use absolute url from config', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'http://sethosts:8000/ausis/';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'result/id/lattice/lat.txt'))
      .toContain('http://sethosts:8000/ausis/');
  }));

  it('should add absolute audio param', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result', 'http://selfhosts/audio/id', 'result/id/lattice/lat.txt'))
      .toContain('/' + encodeURIComponent('http://selfhosts/audio/id'));
  }));

  it('should add absolute lattice param', inject([EditorURLProviderService], (service: EditorURLProviderService) => {
    config.editorUrl = 'olia/';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result', 'audio/id', 'http://selfhosts/result/id/lattice/lat.txt'))
      .toContain('/' + encodeURIComponent('http://selfhosts/result/id/lattice/lat.txt') + '/');
  }));
});
