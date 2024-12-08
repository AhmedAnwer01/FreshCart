import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoriesService } from '../services/categories.service';

export const categoriesResolver: ResolveFn<boolean> = (route, state) => {
  const _CategoriesService = inject(CategoriesService)

  return _CategoriesService.getAllCategories()
};
