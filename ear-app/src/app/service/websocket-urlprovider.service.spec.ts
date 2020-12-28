import { TestBed, inject } from '@angular/core/testing';

import { WebsocketURLProviderService } from './websocket-urlprovider.service';
import { TestAppModule } from '../base/test.app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Config } from '../config';

describe('WebsocketURLProviderService', () => {
  let location: URL;
  let config: Config;

  beforeEach(() => {
    config = new Config();
    TestBed.configureTestingModule({
      providers: [WebsocketURLProviderService,
        { provide: Config, useValue: config }
      ],
      imports: [TestAppModule, RouterTestingModule.withRoutes([])]
    });
    location = new URL('http://host:8000/');
  });

  it('should be created', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    expect(service).toBeTruthy();
  }));

  it('returns ws', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = 'olia';
    expect(service.getURLInternal(location, 'result')).toEqual('ws://host:8000/olia');
  }));

  it('returns path from config.baseServiceUrl', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = 'olia';
    config.baseServiceUrl = 'http://os:8000/ausis'
    expect(service.getURLInternal(location, 'result')).toEqual('ws://os:8000/ausis/olia');
  }));

  it('returns path from config', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = 'olia';
    expect(service.getURLInternal(location, 'result')).toEqual('ws://host:8000/olia');
  }));

  it('use pathname', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = 'olia';
    location.pathname = '/lala';
    expect(service.getURLInternal(location, '')).toEqual('ws://host:8000/lala/olia');
  }));

  it('strip router path', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = 'olia';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, 'result')).toEqual('ws://host:8000/lala/olia');
  }));

  it('handles double slash', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = '/olia';
    location.pathname = '/lala/result';
    expect(service.getURLInternal(location, '/result')).toEqual('ws://host:8000/lala/olia');
  }));

  it('handles no slashes', inject([WebsocketURLProviderService], (service: WebsocketURLProviderService) => {
    config.subscribeUrl = 'olia';
    location.pathname = 'lala/result';
    expect(service.getURLInternal(location, '/result')).toEqual('ws://host:8000/lala/olia');
  }));

});
