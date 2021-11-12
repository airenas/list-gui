import { MatSnackBar } from '@angular/material/snack-bar';
import { TranscriptionService } from '../service/transcription.service';

export abstract class BaseComponent {
  error: string;

  constructor(protected transcriptionService: TranscriptionService, protected snackBar: MatSnackBar) {
    this.error = '';
  }

  showError(msg: string, error: any) {
    console.error('Error', error);
    this.error = this.asString(msg, error);
  }

  asString(msg: string, error: any): string {
    if (error != null) {
      return msg + ' ' + String(error);
    }
    return msg;
  }

  showInfo(info: any) {
    console.log('Info ', info);
    this.snackBar.open(info, null, { duration: 3000 });
  }
}
