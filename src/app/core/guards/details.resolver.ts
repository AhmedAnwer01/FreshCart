import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '../services/products.service';

export const detailsResolver: ResolveFn<boolean> = (route, state) => {

  const _ProductsService = inject(ProductsService)

  return _ProductsService.getProductById(route.paramMap.get("id"));
};
