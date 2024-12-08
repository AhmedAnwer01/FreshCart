import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIBaseUrl } from '../../environment/api';
import { IRegisterForm } from '../interfaces/Iregister-form';
import { IloginForm } from '../interfaces/Ilogin-form';
import { ISuccessMsg } from '../interfaces/isuccess-msg';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IRecoveryEmail } from '../interfaces/forgotPassword/irecovery-email';
import { IResetCode } from '../interfaces/forgotPassword/ireset-code';
import { IResetPassword } from '../interfaces/forgotPassword/ireset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly _HttpClient = inject(HttpClient)
  private readonly _Router = inject(Router)
  constructor() { }
  userData!: any;

  signUp(data: IRegisterForm): Observable<any> {

    return this._HttpClient.post(`${APIBaseUrl}/api/v1/auth/signup`, data);
  }

  signIn(data: IloginForm): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/auth/signin`, data);
  }

  saveUserData(): void {
    if (localStorage.getItem("userToken")) {
      let token!: any;
      token = localStorage.getItem("userToken")
      this.userData = jwtDecode(token)
      // console.log(this.userData);

    }
  }

  signOut() {
    localStorage.removeItem("userToken")
    this.userData = null;
    // call api remove token
    this._Router.navigate(['/login']);
  }


  forgotPassword(email: IRecoveryEmail): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/auth/forgotPasswords`, email)
  }
  verifyResetCode(code: IResetCode): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/auth/verifyResetCode`, code)
  }
  resetPassword(data: IResetPassword): Observable<any> {
    return this._HttpClient.post(`${APIBaseUrl}/api/v1/auth/resetPassword`, data)
  }


}
