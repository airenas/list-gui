import { FileUtils } from './../utils/file';
import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export abstract class Mp4ExtratorService {
  abstract extract(file: File): Observable<File>;
}

@Injectable({
  providedIn: 'root'
})
export class FFMpegMp4ExtratorService implements Mp4ExtratorService {
  ffmpegLib: any;
  constructor() { }

  extract(file: File): Observable<File> {
    return new Observable((observer) => {
      this.loadFFMpeg().subscribe(
        {
          next: (lib) => {
            const transcode = async () => {
              try {
                lib.FS('writeFile', 'in.mp4', await fetchFile(file));

                console.log('Start copy audio');
                await lib.run('-i', 'in.mp4', '-map', '0:a', '-acodec', 'copy', 'output.mp4');

                console.log('Preparing file');
                const data = lib.FS('readFile', 'output.mp4');

                observer.next(FileUtils.fromData(data, 'audio.mp4'));
              } catch (e) {
                observer.error(e);
              }
              observer.complete();
            };
            transcode();
          },
          error: (e) => {
            observer.error(e);
          }
        });
    });
  }

  loadFFMpeg(): Observable<any> {
    if (this.ffmpegLib !== undefined) {
      return of(this.ffmpegLib);
    }
    return new Observable((observer) => {
      const ffmpegTmp = createFFmpeg({
        log: false,
        // corePath: 'dist/ffmpeg-core.js'
      });
      console.log('Loading ffmpeg-core.js');
      ffmpegTmp.load().then(() => {
        console.log('Loaded ffmpeg-core.js');
        this.ffmpegLib = ffmpegTmp;
        observer.next(ffmpegTmp);
      }).catch((err) => {
        console.error('Error loading ffmpeg-core.js', err);
        observer.error(err);
      });
    });
  }
}
