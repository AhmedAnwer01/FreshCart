import { Pipe, PipeTransform } from '@angular/core';
import { arrayBuffer } from 'stream/consumers';
import { IProduct } from '../interfaces/iproduct';

@Pipe({
	name: 'search',
	standalone: true,
})
export class SearchPipe implements PipeTransform {
	transform(arrOfProducts: IProduct[], searchedText: string): IProduct[] {

		return arrOfProducts?.filter((product:IProduct) => {

			return product.title?.toLowerCase().includes(searchedText?.toLowerCase()) ;
		});
	}
}
