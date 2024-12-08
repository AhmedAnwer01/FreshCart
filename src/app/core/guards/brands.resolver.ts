import { ResolveFn } from '@angular/router';
import { BrandsService } from '../services/brands.service';
import { inject } from '@angular/core';

export const brandsResolver: ResolveFn<boolean> = (route, state) => {
  const _BrandsService = inject(BrandsService)

  return _BrandsService.getAllBrands({ page: "1", limit: "30" });

};
