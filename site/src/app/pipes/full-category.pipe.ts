import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullCategory'
})
export class FullCategoryPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'prg':
        return '/prg/';
      case 'mus':
        return '/mus/';
      case 'cin':
        return '/cin/';
      case 'sci':
        return '/sci/';
      case 'art':
        return '/art/';
      case 'pol':
        return '/pol/';
      case 'nor':
        return '/nor/';
      case 'uff':
        return '/uff/';
      default:
        return '/off/';
    }
  }

}
