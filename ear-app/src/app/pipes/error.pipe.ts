import { Pipe, PipeTransform } from '@angular/core';
import { TranscriptionResult } from '../api/transcription-result';
import { ErrorCode } from '../api/error-codes';

export class ErrorPipe implements PipeTransform {
  constructor (private showDetails: boolean) {}

  transform(value: TranscriptionResult): string {
    if (value.errorCode === ErrorCode.TooShortAudio) {
      return 'Per trumpas įrašas';
    }
    if (value.errorCode === ErrorCode.TooLongAudio) {
      return 'Per ilgas įrašas';
    }
    if (value.errorCode === ErrorCode.WrongFormat) {
      return 'Blogas formatas';
    }
    if (value.errorCode === ErrorCode.ServiceError) {
      if (!this.showDetails) {
        return 'Sistemos klaida. Prašome kreiptis į sistemos administratorių info@intelektika.lt';
      }
    }
    if (value.errorCode === ErrorCode.LenDiffer) {
      return 'Pateiktų audio failų trukmė skiriasi';
    }
    return value.error;
  }
}
