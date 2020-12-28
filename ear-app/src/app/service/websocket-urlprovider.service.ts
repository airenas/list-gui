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
    if (this.isSetURL(this.config.baseServiceUrl)) {
      location = new URL(this.config.baseServiceUrl);
      basePathURL = location.pathname;
    } else {
      basePathURL = this.basePathName(location.pathname, routerURL);
    }
    let result = this.getProtocol(location) + location.hostname + this.getPort(location);
    result = PathUtils.addURL(result, basePathURL);
    result = PathUtils.addURL(result, this.config.subscribeUrl);
    return result;
  }

  private getProtocol(location: URL) {
    return location.protocol === 'https:' ? 'wss://' : 'ws://';
  }

  private isSetURL(str: string) {
    return str && (str.startsWith('https:') || str.startsWith('http:'));
  }

  private getPort(location: URL) {
    const defaultPort = location.protocol === 'https:' ? '443' : '80';
    if (location.port !== defaultPort) {
      return ':' + location.port;
    } else {
      return '';
    }
  }

  private basePathName(allPath, routersURL) {
    if (allPath.endsWith(routersURL)) {
      return allPath.substring(0, allPath.length - routersURL.length);
    }
    return '';
  }
}
