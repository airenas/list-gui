import { FileUtils } from './../utils/file';
import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Observable } from 'rxjs/Observable';

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
      const transcode = async (f) => {
        try {
          const ffmpeg = this.loadFFMpeg();

          ffmpeg.FS('writeFile', 'in.mp4', await fetchFile(f));

          console.log('Start copy audio');
          await ffmpeg.run('-i', 'in.mp4', '-map', '0:a', '-acodec', 'copy', 'output.mp4');

          console.log('Preparing file');
          const data = ffmpeg.FS('readFile', 'output.mp4');

          observer.next(FileUtils.fromData(data, 'audio.mp4'));
        } catch (e) {
          observer.error(e);
        }
      };
      transcode(file);
    });
  }

  loadFFMpeg(): any {
    if (this.ffmpegLib === undefined) {
      const ffmpegTmp = createFFmpeg({
        log: false,
        // corePath: 'dist/ffmpeg-core.js'
      });
      console.log('Loading ffmpeg-core.js');
      ffmpegTmp.load();
      console.log('Loaded ffmpeg-core.js');
      this.ffmpegLib = ffmpegTmp;
    }
    return this.ffmpegLib;
  }
}
