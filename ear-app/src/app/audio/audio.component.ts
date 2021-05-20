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
    console.log('after init audio ' + this.divId);
    setTimeout(() => {
      this.audioPlayer = this.audioPlayerFactory.create('#' + this.divId, (ev) => this.cdr.detectChanges());
      this.loadFile(this.file);
    }, 0);
  }

  id(): string {
    // tslint:disable-next-line: no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }

  ngOnDestroy() {
    console.log('Destroy audio ' + this.divId);
    this.audioPlayer.destroy();
  }

  ngOnInit(): void {
    console.log('init audio ' + this.divId);
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
