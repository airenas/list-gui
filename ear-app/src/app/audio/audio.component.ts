import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { AudioPlayer, AudioPlayerFactory } from '../utils/audio.player';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() file: File;
  @Input() showFileName: boolean;
  audioPlayer: AudioPlayer;
  divId: string;

  constructor(private cdr: ChangeDetectorRef, private audioPlayerFactory: AudioPlayerFactory) {
    this.divId = 'audio-' + this.id();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // does not work as divId is not updated
      this.init();
    }, 0);
  }

  init(): void {
    // console.log('init audio: ' + this.divId);
    if (!this.audioPlayer) {
      this.audioPlayer = this.audioPlayerFactory.create('#' + this.divId, (ev) => this.cdr.detectChanges());
    }
    this.loadFile(this.file);
  }

  id(): string {
    // tslint:disable-next-line: no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }

  ngOnDestroy() {
    this.audioPlayer.destroy();
  }

  ngOnInit(): void {
  }

  canPlayAudio(): boolean {
    return this.audioPlayer && !this.audioPlayer.isPlaying() && this.file != null;
  }

  canStopAudio(): boolean {
    return this.audioPlayer && this.audioPlayer.isPlaying();
  }

  playAudio() {
    this.audioPlayer.play();
  }

  stopAudio() {
    this.audioPlayer.pause();
  }

  loadFile(file: File) {
    this.file = file;
    if (file != null) {
      this.audioPlayer.loadFile(file);
    } else {
      this.audioPlayer.clear();
    }
  }
}
