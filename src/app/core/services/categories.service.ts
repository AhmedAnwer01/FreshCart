import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIBaseUrl } from '../../environment/api';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly _HttpClient = inject(HttpClient)
  constructor() { }
  
  getAllCategories(): Observable<any> {
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/categories`)
  }
  getCategoryById(id: string): Observable<any> {
    return this._HttpClient.get(`${APIBaseUrl}/api/v1/categories/${id}`)
  }
}
