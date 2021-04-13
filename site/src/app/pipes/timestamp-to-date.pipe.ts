import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@google-cloud/firestore';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {

  transform(value: Timestamp, ...args: any[]): any {
    return new Date(value.toMillis()).toLocaleString([], { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

}
