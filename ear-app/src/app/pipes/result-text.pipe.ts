import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resultText'
})
export class ResultTextPipe implements PipeTransform {
  transform(value: string): string {
    if (value === null) {
      return value;
    }
    value = this.takeMax(value, 150)
    const re = /\n/gi;
    return '  ' + value.replace(re, '\n  ');
  }

  takeMax(value: string, count: number): string {
    if (value.length > count) {
      value = value.substring(0, count) + '...';
    }
    return value;
  }
}
