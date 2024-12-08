import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIBaseUrl } from '../../environment/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient)
  constructor() { }
  static cartCount: BehaviorSubject<any> = new BehaviorSubject(0)



  addProductToCart(id: string): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/cart`, {
      "productId": id,
    })
  }

  getProductsCart(): Observable<any> {
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/cart`)
  }

  deleteProduct(id: string): Observable<any> {
    return this._HttpClient.delete(`${APIBaseUrl}/api/v1/cart/${id}`)
  }
  updateCartItemCount(id: string, count: number): Observable<any> {
    return this._HttpClient.put(`${APIBaseUrl}/api/v1/cart/${id}`, {
      "count": count
    })
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(`${APIBaseUrl}/api/v1/cart`)
  }
}
