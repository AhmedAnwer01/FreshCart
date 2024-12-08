import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/iproduct';

@Pipe({
  name: 'sortByPrice',
  standalone: true
})
export class SortByPricePipe implements PipeTransform {

  transform(arrOfProducts: IProduct[], sortingMethod: string): IProduct[] {

    if (sortingMethod == "lowest") {
      // console.log(arrOfProducts);
      return arrOfProducts?.reverse()
    } else {
      return arrOfProducts?.reverse()
    }
  }

}

