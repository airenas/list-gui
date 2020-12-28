import { PathUtils } from './../utils/path';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../config';

@Injectable()
export class EditorURLProviderService {
  constructor(private config: Config, private router: Router) { }

  public getURL(audioURL: string, latticeURL: string): string {
    return this.getURLInternal(new URL(window.location.href), this.router.url, audioURL, latticeURL);
  }

  getURLInternal(location: URL, routerURL: string, audioURL: string, latticeURL: string): string {
    const basePathURL = this.basePathName(location.pathname, routerURL);
    let mainUrl = location.protocol + '//' + location.hostname + this.getPort(location);
    mainUrl = PathUtils.addURL(mainUrl, basePathURL);
    let result = mainUrl;
    result = PathUtils.addURL(result, this.config.editorUrl);
    result = PathUtils.addURL(result, encodeURIComponent(PathUtils.addURL(mainUrl, latticeURL)));
    result = PathUtils.addURL(result, encodeURIComponent(PathUtils.addURL(mainUrl, audioURL)));
    return result;
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
