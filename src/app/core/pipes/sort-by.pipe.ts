import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true
})
export class SortByPipe implements PipeTransform {

  transform(arrOfObject: any[], sortingType: "Latest" | "Oldest"): any[] {
    let len = arrOfObject.length
    if (sortingType == "Latest" && arrOfObject[0].index == 1) {
      return arrOfObject.reverse()

    } else if (sortingType == "Oldest" && arrOfObject[0].index == arrOfObject.length) {
      return arrOfObject.reverse()
    }
    return arrOfObject
  }

}
