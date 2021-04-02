import { Observable } from 'rxjs/Observable';
import { SendFileResult } from './../api/send-file-result';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { TranscriptionService } from '../service/transcription.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from '../base/base.component';
import { ParamsProviderService } from '../service/params-provider.service';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AudioPlayer, AudioPlayerFactory } from '../utils/audio.player';
import { Microphone, MicrophoneFactory } from '../utils/microphone';
import { environment } from 'src/environments/environment';
import 'rxjs/add/observable/interval';
import { of } from 'rxjs/internal/observable/of';
import { FileUtils } from '../utils/file';
import { Mp4ExtratorService } from '../service/mp4-extrator.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

const AudioType = 0;
const PhoneAudioType = 1;
const VideoType = 2;

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

  selectedFile: File; // hold our file
  selectedFileName: string; // hold our file name
  private _email: string;
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

  ngOnInit() {
    console.log('Init upload');
    this.inputIndexInt = this.paramsProviderService.getInputMethod();
    this.audioPlayer = this.audioPlayerFactory.create('#audioWaveDiv', (ev) => this.cdr.detectChanges());
    this.recorder = this.microphoneFactory.create('#micWaveDiv', (ev, data) => this.recordEvent(ev, data));
    this._email = this.paramsProviderService.getEmail();
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
    this.speakerCountValues = [{ id: '-', name: '--', tooltip: 'Automatiškai nustatomas diktorių skaičius' },
    { id: '1', name: '1', tooltip: 'Vieno diktoriaus garso įrašas' },
    { id: '2', name: '2', tooltip: 'Garso įraše kalba du diktoriai' }];
    this._speakerCount = this.paramsProviderService.getSpeakerCount();
    if ((this._speakerCount || '') === '') {
      this._speakerCount = '-';
    }
  }

  initParams() {
    this._uploadParamSkipNumJoin = this.route.snapshot.queryParamMap.get('skipNumJoin') === '1';
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

  openInputPhone() {
    document.getElementById('hiddenFileInputPhone').click();
  }

  dropFile(files: File[], ext: string[]) {
    for (const f of files) {
      if (FileUtils.hasExtension(f.name, ext)) {
        this.fileChange(f);
        return;
      }
    }
    this.fileChange(null);
  }

  filesChange(files: File[]) {
    if (files.length > 0) {
      this.fileChange(files[0]);
    } else {
      this.fileChange(null);
    }
  }

  fileChange(file: File): void {
    this.selectedFile = null;
    this.selectedFileName = null;
    this.paramsProviderService.lastSelectedFile = file;
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = this.selectedFile.name;
    }
    this.showAudioFile(file);
  }

  upload() {
    // console.log('sending this to server', this.selectedFile);
    this.sending = true;

    let fo = of(this.selectedFile);
    if (this.inputIndex === VideoType) {
      fo = this.mp4Extractor.extract(this.selectedFile);
    }
    fo.subscribe({
      next: (file) => {
        this.transcriptionService.sendFile({
          file: file, fileName: this.selectedFileName, email: this.email,
          recognizer: this.recognizer(this.inputIndex),
          speakerCount: (this.speakerCount === '-' ? '' : this.speakerCount),
          skipNumJoin: this._uploadParamSkipNumJoin
        })
          .subscribe(
            result => {
              this.sending = false;
              this.onResult(result);
            },
            error => {
              this.sending = false;
              this.showError('Nepavyko nusiųsti failo.', error);
            }
          );
      },
      error: (error) => {
        this.sending = false;
        this.showError('Nepavyko konvertuoti failą.', error);
      }
    });
  }

  onResult(result: SendFileResult) {
    this.fileChange(null);
    this.showInfo('Failas nusiųstas. Transkripcijos ID: ' + result.id);
    this.router.navigateByUrl('/results/' + result.id, { skipLocationChange: true });
  }

  turnAudioInput() {
    this.inputIndex = AudioType;
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

  recognizer(index: number): string {
    if (index === 0) {
      return 'audioDefault';
    }
    if (index === 1) {
      return 'audioPhone';
    }
    if (index === 2) {
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
    return this.selectedFile && this._email && !this.recorder.recording;
  }

  canPlayAudio(): boolean {
    return !this.audioPlayer.isPlaying() && this.selectedFile != null;
  }

  canStopAudio(): boolean {
    return this.audioPlayer.isPlaying();
  }

  showAudioFile(file: File) {
    if (file != null) {
      this.audioPlayer.loadFile(file);
    } else {
      this.audioPlayer.clear();
    }
  }

  playAudio() {
    this.audioPlayer.play();
  }

  stopAudio() {
    this.audioPlayer.pause();
  }

  startRecord() {
    this.fileChange(null);
    this.cancelingRecording = false;
    this.recorder.start();
  }

  stopRecord() {
    this.recorder.stop();
  }

  showVersion() {
    this.versionClick++;
    if (this.versionClick > 4) {
      this.showInfo('Version: ' + environment.version);
    }
  }
}

interface SpeakerCount {
  id: string;
  name: string;
  tooltip?: string;
}
