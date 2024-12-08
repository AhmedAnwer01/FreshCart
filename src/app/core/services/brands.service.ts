import { APIBaseUrl } from './../../environment/api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor() { }

  private readonly _HttpClient = inject(HttpClient)

  getAllBrands(queryParams?: { [key: string]: string }): Observable<any> {
    let params = new HttpParams()

    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params = params.append(key, queryParams[key])
      }
    }
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/brands`, { params })
  }
  getBrandById(id: string): Observable<any> {
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/brands/${id}`)
  }

}
