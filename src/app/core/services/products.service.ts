import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIBaseUrl } from '../../environment/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly _HttpClient = inject(HttpClient)
  constructor() { }

  getAllProducts(queryParams?: { [key: string]: string }): Observable<any> {
    let params = new HttpParams()

    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params = params.append(key, queryParams[key])
      }
    }
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/products`, { params })
  }
  getProductById(id: string | null): Observable<any> {
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/products/${id}`)
  }
}
