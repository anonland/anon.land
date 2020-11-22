import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullCategory'
})
export class FullCategoryPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'prg':
        return 'Preguntas';
      case 'mus':
        return 'Música';
      case 'pel':
        return 'Películas';
      case 'cie':
        return 'Ciencia';
      case 'art':
        return 'Arte';
      case 'pro':
        return 'Programación';
      default:
        return 'General';
    }
  }

}
