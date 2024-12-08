import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bestProducts',
  standalone: true
})
export class BestProductsPipe implements PipeTransform {

  transform(arrOfObject: any[]): any[] {
    return arrOfObject?.filter((item) => {
      return item?.ratingsQuantity >= 60
    });
  }

}
