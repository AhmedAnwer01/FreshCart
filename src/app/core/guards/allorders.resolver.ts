import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OrdersService } from '../services/orders.service';

export const allordersResolver: ResolveFn<boolean> = (route, state) => {
  const _OrdersService = inject(OrdersService)

  return _OrdersService.getUserOrders()
};
