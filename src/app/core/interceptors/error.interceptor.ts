import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const _ToastrService = inject(ToastrService);
  const _TranslateService = inject(TranslateService);  // Inject TranslateService

  return next(req).pipe(
    catchError((err) => {
      console.error("Error", err);

      if (err?.error?.errors?.msg) {
        _ToastrService.error(err?.error?.errors?.msg, _TranslateService.instant('Error'));

      } else if (err?.error?.message) {
        let msgError = err?.error?.message;

        //Defined Error
        if (msgError === "Failed to fetch") {
          msgError = _TranslateService.instant('errors.connectionFailed');
        } else if (msgError === "There is no user registered with this email address  undefined") {
          msgError = _TranslateService.instant('errors.emailNotRegistered');
        } else if (msgError === "The \"data\" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined") {
          msgError = _TranslateService.instant('errors.backendError');
        } else if (msgError === "Can't find this route: /api/v1/auth/resetPassword") {
          msgError = _TranslateService.instant('errors.unknownRoute');
        } else if (msgError === "Incorrect email or password") {
          msgError = _TranslateService.instant('errors.incorrectEmailOrPassword'); 
        }else if(msgError === "Account Already Exists"){
          msgError = _TranslateService.instant('errors.AccountAlreadyExists');
        }

        // Error is not pre-defined 
        else if (msgError) {
          msgError = err?.error?.message
        } else {
          msgError = _TranslateService.instant("error.unknownError")
        }

        // Finally Print the Error in a Toastr
        _ToastrService.error(msgError, _TranslateService.instant('errors.Error'));
      }

      return throwError(err);
    })
  );
};
