import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullCategory'
})
export class FullCategoryPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'prg':
        return '/prg/ ~ Preguntas';
      case 'mus':
        return '/mus/ ~ Música';
      case 'cin':
        return '/cin/ ~ Cine';
      case 'sci':
        return '/sci/ ~ Ciencia y Tecnonlogía';
      case 'art':
        return '/art/ ~ Arte';
      case 'pol':
        return '/pol/ ~ Política';
      case 'nor':
        return '/nor/ ~ Normie';
      case 'uff':
        return '/uff/ ~ Random';
      default:
        return '/off/ ~ General';
    }
  }

}
