import { Token } from '@angular/compiler';
import { serverUrl } from './../../environment/serverUrl';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ShippingAddress } from '../interfaces/shipping-address';
import { APIBaseUrl } from '../../environment/api';
import { Observable } from 'rxjs';
import { Iorder } from '../interfaces/iorder';
import { jwtDecode } from 'jwt-decode';
import { IuserData } from '../interfaces/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor() { }

  public static allOrders: Iorder[] = []

  token: any = localStorage.getItem("userToken")
  userData: IuserData = jwtDecode(this.token)

  private readonly _HttpClient = inject(HttpClient)

  createOrder(cartId: string | null, shippingAddress: ShippingAddress): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/orders/${cartId}?url=${serverUrl}`, shippingAddress,)
  }
  getUserOrders(): Observable<any> {
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/orders/user/${this.userData.id}`)
  }

  checkOutSession(ShippingAddress: ShippingAddress, cartId: string ): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/orders/checkout-session/${cartId}?url=${serverUrl}`, ShippingAddress, {
      params: { serverUrl }
    })
  }
}
