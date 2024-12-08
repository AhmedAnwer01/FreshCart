import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import { isErrored } from 'stream';
import { isStringObject } from 'util/types';
import { json } from 'stream/consumers';

export const homeResolver: ResolveFn<boolean> = (route, state) => {
  const _CategoriesService = inject(CategoriesService)
  const _ProductsService = inject(ProductsService)

  return _CategoriesService.getAllCategories();
};
