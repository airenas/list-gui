import { TranscriptionResult } from './../api/transcription-result';
import { Config } from './../config';
import { Injectable } from '@angular/core';
import { FileData } from './file-data';
import { SendFileResult } from './../api/send-file-result';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { throwError } from 'rxjs';
import { Recognizer } from '../api/recognizer';

@Injectable()
export abstract class TranscriptionService {
  abstract sendFile(fileData: FileData): Observable<SendFileResult>;
  abstract getResult(id: string): Observable<TranscriptionResult>;
  abstract getRecognizers(): Observable<Recognizer[]>;
}

@Injectable()
export class HttpTranscriptionService implements TranscriptionService {

  sendFileUrl: string;
  statusUrl: string;
  recognizersUrl: string;

  static asString(error: HttpErrorResponse): string {
    if (error !== null) {
      if (error.status === 401) {
        return 'Vartotojo kodas negalioja';
      }
      if (error.status === 403) {
        return 'Nepakanka kreditų. Prašome pateikti mažesnės apimties failą arba išsipirkti papildomai kreditų';
      }
      const value = String(error.error);
      if (value.includes('Wrong email')) {
        return 'Neteisingas El. paštas';
      }
      if (value.includes('No email')) {
        return 'Nenurodytas El. paštas';
      }
      if (value.includes('No file')) {
        return 'Nenurodytas failas';
      }
      if (value.includes('No recognizer') || value.includes('Unknown recognizer:')) {
        return 'Nepavyko parinkti atpažintuvą';
      }
      if (value.includes('sepSpeakersOnChannel') || value.includes('not supported with multiple files')) {
        return 'Negalimas "Kalbėtojų skaičiaus" pasirinkimas';
      }
    }
    return 'Sistemos klaida. Prašome kreiptis į sistemos administratorių info@intelektika.lt';
  }

  constructor(public _http: HttpClient, _config: Config) {
    this.sendFileUrl = _config.sendFileUrl;
    this.statusUrl = _config.statusUrl;
    this.recognizersUrl = _config.recognizersUrl;
  }

  sendFile(fileData: FileData): Observable<SendFileResult> {
    const formData = new FormData();
    Array.from(fileData.files).forEach(function (f, i, files) {
      let suf = '';
      if (i > 0) {
        suf = (i + 1).toString();
      }
      formData.append('file' + suf, f, f.name);
    });
    formData.append('email', fileData.email);
    formData.append('recognizer', fileData.recognizer === '' ? '' : fileData.recognizer);
    formData.append('numberOfSpeakers', fileData.speakerCount === '' ? '' : fileData.speakerCount);
    if (fileData.skipNumJoin === true) {
      formData.append('skipNumJoin', '1');
    }
    if (fileData.sepSpeakersOnChannel === true) {
      formData.append('sepSpeakersOnChannel', '1');
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      params: new HttpParams()
    };
    if (fileData.key !== '') {
      httpOptions.params = httpOptions.params.append('key', fileData.key);
    }
    return this._http.post(this.sendFileUrl, formData, httpOptions)
      .map(res => {
        return <SendFileResult>res;
      })
      .catch(this.handleError);
  }

  getResult(id: string): Observable<TranscriptionResult> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    return this._http.get(this.statusUrl + id, httpOptions)
      .map(res => {
        return <TranscriptionResult>res;
      })
      .catch(e => this.handleError(e));
  }

  getRecognizers(): Observable<Recognizer[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    return this._http.get(this.recognizersUrl, httpOptions)
      .map(res => {
        return <Recognizer[]>res;
      })
      .catch(e => this.handleError(e));
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    const errStr = HttpTranscriptionService.asString(error);
    return throwError(errStr);
  }

  protected getHeader() {
    const result = new Headers();
    // result.append('Content-Type', 'application/json');
    return result;
  }
}
