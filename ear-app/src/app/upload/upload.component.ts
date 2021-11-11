import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../base/base.component';
import { Mp4ExtratorService } from '../service/mp4-extrator.service';
import { ParamsProviderService } from '../service/params-provider.service';
import { TranscriptionService } from '../service/transcription.service';
import { AudioPlayer, AudioPlayerFactory } from '../utils/audio.player';
import { FileUtils } from '../utils/file';
import { Microphone, MicrophoneFactory } from '../utils/microphone';
import { SendFileResult } from './../api/send-file-result';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(protected transcriptionService: TranscriptionService,
    private router: Router, protected snackBar: MatSnackBar, private paramsProviderService: ParamsProviderService,
    private cdr: ChangeDetectorRef, private audioPlayerFactory: AudioPlayerFactory,
    private microphoneFactory: MicrophoneFactory,
    private route: ActivatedRoute, private mp4Extractor: Mp4ExtratorService) {
    super(transcriptionService, snackBar);
  }

  files: File[];
  selectedFileName: string; // hold our file name
  private _email: string;

  userKeyPlaceHolder: string;
  keyType: string;

  private _conditionChecked: boolean;

  private _userKey: string;
  recorder: Microphone;
  audioPlayer: AudioPlayer;
  sending = false;
  versionClick = 0;
  destroyind: boolean;
  cancelingRecording = false;
  inputIndexInt: number;

  private _speakerCount: string;
  speakerCountValues: SpeakerCount[];
  _uploadParamSkipNumJoin = false;

  AudioType = 0;
  PhoneAudioType = 1;
  VideoType = 2;
  ZoomType = 3;

  ngOnInit() {
    console.log('Init upload');
    this.inputIndexInt = this.paramsProviderService.getInputMethod();
    this.audioPlayer = this.audioPlayerFactory.create('#audioWaveDiv', (ev) => this.cdr.detectChanges());
    this.recorder = this.microphoneFactory.create('#micWaveDiv', (ev, data) => this.recordEvent(ev, data));
    this._email = this.paramsProviderService.getEmail();
    this._conditionChecked = this.paramsProviderService.getCondition();
    this.initSpeakerCount();
    this.initParams();
  }

  ngAfterViewInit() {
    console.log('View init');
    if (this.paramsProviderService.lastSelectedFile !== null) {
      const tm = Observable.interval(50).subscribe((v) => {
        console.log('On file timer');
        tm.unsubscribe();
        this.fileChange(this.paramsProviderService.lastSelectedFile);
      });
    }
  }

  ngOnDestroy() {
    console.log('Destroy upload');
    this.destroyind = true;
    this.cancelRecording();
    this.audioPlayer.destroy();
  }

  cancelRecording() {
    if (this.recorder.recording) {
      this.cancelingRecording = true;
      this.recorder.stop();
    }
  }

  initSpeakerCount() {
    this.speakerCountValues = [
      { id: '1', name: '1', tooltip: 'Vieno kalbėtojo garso įrašas' },
      { id: '2', name: '2', tooltip: 'Garso įraše kalba du kalbėtojai' },
      { id: '-', name: 'Pasirinkti automatiškai', tooltip: 'Automatiškai nustatomas kalbėtojų skaičius' }
    ];
    this._speakerCount = this.paramsProviderService.getSpeakerCount();
    if ((this._speakerCount || '') === '') {
      this._speakerCount = '-';
    }
  }

  initParams() {
    this._uploadParamSkipNumJoin = this.route.snapshot.queryParamMap.get('skipNumJoin') === '1';
    this.hideKey();
    this._userKey = this.paramsProviderService.getUserKey();
    this.updateUserkeyPlaceHolder(this._userKey);
    console.log('skipNumJoin=', this._uploadParamSkipNumJoin);
  }

  recordEvent(ev: string, data: any): void {
    console.log('recordEvent: ' + ev);
    if (this.destroyind || this.cancelingRecording) {
      return;
    }
    if (ev === 'data') {
      this.fileChange(FileUtils.fromData(data, 'audio.wav'));
    } else if (ev === 'error') {
      this.showError('Nepavyko inicializuoti mikrofono.', data);
    }
  }

  openInput() {
    document.getElementById('hiddenFileInput').click();
  }

  openInputVideo() {
    document.getElementById('hiddenFileInputVideo').click();
  }

  openInputZoom() {
    document.getElementById('hiddenFileInputZoom').click();
  }

  openInputPhone() {
    document.getElementById('hiddenFileInputPhone').click();
  }

  dropFile(files: File[], ext: string[], multiple: boolean) {
    const res = [];
    for (const f of files) {
      if (FileUtils.hasExtension(f.name, ext)) {
        if (multiple) {
          res.push(f);
        } else {
          this.fileChange(f);
          return;
        }
      }
    }
    this.filesChange(res);
  }

  filesChange(files: File[]) {
    let f = files;
    if (f?.length > 10) {
      f = f.slice(0, 10);
    }
    this.files = f;
    this.selectedFileName = this.getFileNames(this.files);
  }

  fileChange(file: File): void {
    this.paramsProviderService.lastSelectedFile = file;
    let f: File[] = [];
    if (file) {
      f = [file];
    }
    this.filesChange(f);
  }

  getFileNames(files: File[]): string {
    return Array.from(files).map(f => f.name).join(', ');
  }

  upload() {
    this.sending = true;
    this.error = '';

    if (this.inputIndex === this.VideoType) {
      this.mp4Extractor.extract(this.files[0]).subscribe({
        next: (file) => {
          this.uploadFiles([file]);
        },
        error: (error) => {
          this.sending = false;
          this.showError('Nepavyko konvertuoti failą.', error);
        }
      });
    } else {
      this.uploadFiles(this.files);
    }
  }

  uploadFiles(files: File[]) {
    this.transcriptionService.sendFile({
      files: files, email: this.email,
      recognizer: this.recognizer(this.inputIndex),
      speakerCount: ((this.speakerCount ?? '-') === '-' ? '' : this.speakerCount),
      skipNumJoin: this._uploadParamSkipNumJoin,
      key: this._userKey ?? ''
    })
      .subscribe(
        result => {
          this.sending = false;
          this.onResult(result);
        },
        error => {
          this.sending = false;
          this.showError('', error);
        }
      );
  }

  onResult(result: SendFileResult) {
    this.fileChange(null);
    this.showInfo('Failas nusiųstas. Transkripcijos ID: ' + result.id);
    this.router.navigateByUrl('/results/' + result.id, { skipLocationChange: true });
  }

  turnAudioInput() {
    this.inputIndex = this.AudioType;
  }

  get inputIndex(): number {
    return this.inputIndexInt;
  }

  set inputIndex(value: number) {
    this.cancelRecording();
    this.inputIndexInt = value;
    this.paramsProviderService.setInputMethod(value);
    this.fileChange(null);
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
    this.paramsProviderService.setEmail(email);
  }

  get conditionChecked(): boolean {
    return this._conditionChecked;
  }

  set conditionChecked(conditionChecked: boolean) {
    this._conditionChecked = conditionChecked;
    this.paramsProviderService.setCondition(conditionChecked);
  }

  get userKey(): string {
    return this._userKey;
  }

  set userKey(userKey: string) {
    this._userKey = userKey;
    this.updateUserkeyPlaceHolder(this._userKey);
    this.paramsProviderService.setUserKey(this._userKey);
  }

  recognizer(index: number): string {
    if (index === this.AudioType || index === this.ZoomType) {
      return 'audioDefault';
    }
    if (index === this.PhoneAudioType) {
      return 'audioPhone';
    }
    if (index === this.VideoType) {
      return 'audioDefault';
    }
    console.error('Unknown inputIndex', index);
    return '';
  }

  get speakerCount(): string {
    return this._speakerCount;
  }

  set speakerCount(speakerCount: string) {
    this._speakerCount = speakerCount;
    this.paramsProviderService.setSpeakerCount(speakerCount);
  }

  isValid() {
    return  this.conditionChecked && this.files?.length && this._email && !this.recorder.recording;
  }

  startRecord() {
    this.fileChange(null);
    this.cancelingRecording = false;
    this.recorder.start();
  }

  stopRecord() {
    this.recorder.stop();
  }

  canStartRecord() {
    return true;
  }

  showVersion() {
    this.versionClick++;
    if (this.versionClick > 4) {
      this.showInfo('Version: ' + environment.version);
    }
  }

  updateUserkeyPlaceHolder(_userKey: string) {
    this.userKeyPlaceHolder = (_userKey ?? '') === '' ? "Įveskite vartotojo kodą. Demo versijoje nereikia" : 'Vartotojo kodas';
  }

  showKey() {
    this.keyType = "";
  }

  hideKey() {
    this.keyType = "password";
  }

  conditionClick() {
    this.conditionChecked = !this.conditionChecked;
  }
}

interface SpeakerCount {
  id: string;
  name: string;
  tooltip?: string;
}
