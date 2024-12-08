import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CartService } from '../services/cart.service';

export const cartResolver: ResolveFn<boolean> = (route, state) => {
  const _CartService = inject(CartService)
  return _CartService.getProductsCart();
};
