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
    let basePathURL = '';
    if (PathUtils.isSetURL(this.config.baseServiceUrl)) {
      location = new URL(this.config.baseServiceUrl);
      basePathURL = location.pathname;
    } else {
      basePathURL = PathUtils.basePathName(location.pathname, routerURL);
    }
    let mainUrl = location.protocol + '//' + location.hostname + PathUtils.getPort(location);
    mainUrl = PathUtils.addURL(mainUrl, basePathURL);
    let result = mainUrl;
    if (PathUtils.isSetURL(this.config.editorUrl)) {
      result = this.config.editorUrl;
    } else {
      result = PathUtils.addURL(result, this.config.editorUrl);
    }
    if (PathUtils.isSetURL(latticeURL)) {
      result = PathUtils.addURL(result, encodeURIComponent(latticeURL));
    } else {
      result = PathUtils.addURL(result, encodeURIComponent(PathUtils.addURL(mainUrl, latticeURL)));
    }
    if (PathUtils.isSetURL(audioURL)) {
      result = PathUtils.addURL(result, encodeURIComponent(audioURL));
    } else {
      result = PathUtils.addURL(result, encodeURIComponent(PathUtils.addURL(mainUrl, audioURL)));
    }
    return result;
  }
}
