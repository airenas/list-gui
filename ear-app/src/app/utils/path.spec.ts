import { PathUtils } from './path';
import { TestBed, inject } from '@angular/core/testing';

describe('PathUtils', () => {

  it('should be no double slash', () => {
    expect(PathUtils.addURL('https://olia/', '/aa')).toEqual('https://olia/aa');
  });

  it('should add slash', () => {
    expect(PathUtils.addURL('https://olia', 'aa')).toEqual('https://olia/aa');
  });

  it('should join', () => {
    expect(PathUtils.addURL('https://olia/', 'aa')).toEqual('https://olia/aa');
    expect(PathUtils.addURL('https://olia', '/aa')).toEqual('https://olia/aa');
  });

  it('is path', () => {
    expect(PathUtils.isSetURL('https://olia/')).toBeTruthy();
    expect(PathUtils.isSetURL('http://olia/')).toBeTruthy();
    expect(PathUtils.isSetURL('olia/')).toBeFalsy();
  });

  it('get port path', () => {
    expect(PathUtils.getPort(new URL('https://olia/'))).toEqual('');
    expect(PathUtils.getPort(new URL('http://olia/'))).toEqual('');
    expect(PathUtils.getPort(new URL('https://olia:443/'))).toEqual('');
    expect(PathUtils.getPort(new URL('http://olia:80/'))).toEqual('');
    expect(PathUtils.getPort(new URL('http://olia:8000/'))).toEqual(':8000');
  });
});
