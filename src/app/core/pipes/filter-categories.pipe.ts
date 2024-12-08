import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategories',
  standalone: true
})
export class FilterCategoriesPipe implements PipeTransform {

  transform(allProducts: any[], searchedCategory: string): any[] {

    return allProducts?.filter((product) => {
      return product.category.name.toLowerCase().startsWith(searchedCategory.toLowerCase());
    });

  }

}
