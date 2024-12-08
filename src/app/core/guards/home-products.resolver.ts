import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '../services/products.service';

export const homeProductsResolver: ResolveFn<boolean> = (route, state) => {
  
  const _ProductsService = inject(ProductsService)
  return _ProductsService.getAllProducts({page:"2"});
};
