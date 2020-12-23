import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from './config';

@Component({
  selector: 'app-list',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('service-url') serviceURL: string;
  // tslint:disable-next-line: no-input-rename
  @Input('transcription-id') transcriptionID: string;

  constructor(protected config: Config, private router: Router) { }

  ngOnInit() {
    console.log('ServiceURL=' + this.serviceURL);
    if (this.serviceURL !== '') {
      this.config.init(this.serviceURL);
    }
    if (this.transcriptionID && this.transcriptionID !== '') {
      this.config.init(this.serviceURL);
      this.router.navigateByUrl('/results/' + this.transcriptionID, {skipLocationChange: true});
    } else {
      this.router.navigateByUrl('/upload', {skipLocationChange: true});
    }
  }
}
