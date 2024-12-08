import { ResolveFn } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { inject } from '@angular/core';

export const productsResolver: ResolveFn<boolean> = (route, state) => {
  const _ProductsService = inject(ProductsService)
  return _ProductsService.getAllProducts({page:"1", limit: "30"});
};
