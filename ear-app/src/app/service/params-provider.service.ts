import { Injectable } from '@angular/core';

@Injectable()
export abstract class ParamsProviderService {
  lastSelectedFile: File;
  showErrorDetails: boolean;
  abstract setEmail(email: string): void;
  abstract getEmail(): string;
  abstract setTranscriptionID(id: string): void;
  abstract getTranscriptionID(): string;
  abstract setRecognizer(recognizer: string): void;
  abstract getRecognizer(): string;
  abstract setSpeakerCount(speakerCount: string): void;
  abstract getSpeakerCount(): string;
  abstract setInputMethod(inp: number): void;
  abstract getInputMethod(): number;
}

@Injectable()
export class LocalStorageParamsProviderService implements ParamsProviderService {

  private _transcriptionID: string;
  lastSelectedFile: File;
  showErrorDetails = false;
  private _email: string;
  private _recognizer: string;
  private _speakerCount: string;
  private _inputMethod: number;

  constructor() {
  }
  setInputMethod(inp: number): void {
    this._inputMethod = inp;
    localStorage.setItem('inputMethod', inp.toString());
  }
  getInputMethod(): number {
    if (this._inputMethod == null) {
      this._inputMethod = this.getNumber('inputMethod');
    }
    return this._inputMethod;
  }
  setSpeakerCount(speakerCount: string): void {
    this._speakerCount = speakerCount;
    localStorage.setItem('speakerCount', speakerCount);
  }

  getSpeakerCount(): string {
    if (this._speakerCount == null) {
      this._speakerCount = localStorage.getItem('speakerCount');
    }
    return this._speakerCount;
  }

  setEmail(email: string): void {
    this._email = email;
    localStorage.setItem('email', email);
  }

  getEmail(): string {
    if (this._email == null) {
      this._email = localStorage.getItem('email');
    }
    return this._email;
  }

  setTranscriptionID(id: string): void {
    this._transcriptionID = id;
    localStorage.setItem('transcriptionID', id);
  }

  getTranscriptionID(): string {
    if (this._transcriptionID == null) {
      this._transcriptionID = localStorage.getItem('transcriptionID');
    }
    return this._transcriptionID;
  }

  setRecognizer(recognizer: string): void {
    this._recognizer = recognizer;
    localStorage.setItem('recognizer', recognizer);
  }

  getRecognizer(): string {
    if (this._recognizer == null) {
      this._recognizer = localStorage.getItem('recognizer');
    }
    return this._recognizer;
  }

  getNumber(key: string): number {
    const val = localStorage.getItem(key);
    if (val) {
      return Number(val || '0');
    }
    return null;
  }
}
