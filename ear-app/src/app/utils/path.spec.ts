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
});
