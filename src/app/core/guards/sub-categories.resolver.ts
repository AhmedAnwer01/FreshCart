import { inject } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { SubCategoriesService } from '../services/sub-categories.service';

export const subCategoriesResolver: ResolveFn<boolean> = (route, state) => {

  const _SubCategoriesService = inject(SubCategoriesService)

  const catId = route.paramMap.get("categoryId") || ""
  return _SubCategoriesService.getSubCategoriesByCategoryId(catId)
};
