import { PathUtils } from './../utils/path';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../config';

@Injectable()
export class WebsocketURLProviderService {
  constructor(private config: Config, private router: Router) { }

  public getURL() {
    return this.getURLInternal(new URL(window.location.href), this.router.url);
  }

  getURLInternal(location: URL, routerURL: string): string {
    let basePathURL = '';
    if (PathUtils.isSetURL(this.config.baseServiceUrl)) {
      location = new URL(this.config.baseServiceUrl);
      basePathURL = location.pathname;
    } else {
      basePathURL = PathUtils.basePathName(location.pathname, routerURL);
    }
    let result = this.getProtocol(location) + location.hostname + PathUtils.getPort(location);
    result = PathUtils.addURL(result, basePathURL);
    result = PathUtils.addURL(result, this.config.subscribeUrl);
    return result;
  }

  private getProtocol(location: URL) {
    return location.protocol === 'https:' ? 'wss://' : 'ws://';
  }
}
