import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, tap, throwError } from 'rxjs';


export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const _toastr = inject(ToastrService)
  const _NgxSpinnerService = inject(NgxSpinnerService)
  req = req.clone()

  if (req.url.endsWith("cart") && req.method == "POST") {

    return next(req).pipe(

      catchError((err) => {
        _toastr.error(err.error.message, "Error")
        return throwError((err))

      }),
      tap((response) => {
        if (response.type != 0) {

          _NgxSpinnerService.show("cart-loading")
          setTimeout(() => {
            _NgxSpinnerService.hide("cart-loading")
          }
            , 2500)
        }
      })

    )
  }
  else if (req.url.includes("cart") && !req.url.endsWith("cart") && req.method == "DELETE") {
    return next(req).pipe(tap((response) => {
      if (response.type != 0) {
        _NgxSpinnerService.show("remove-from-cart")
        setTimeout(() => {
          _NgxSpinnerService.hide("remove-from-cart")
        }
          , 500)
      }
    }),
      catchError((err) => {
        _toastr.error(err.error.message, "Error")
        return throwError(err)
      }))
  }
  else if (req.url.endsWith("cart") && req.method == "DELETE") {
    return next(req).pipe(tap((response) => {
      if (response.type != 0) {
        _NgxSpinnerService.show("clear-cart")
        setTimeout(() => {
          _NgxSpinnerService.hide("clear-cart")
        }, 500)
      }
    }),
      catchError((err) => {
        _toastr.error(err.error.message, "Error")
        return throwError(err)

      }))
  }
  else {
    if (req.url.includes("cart") && !req.url.endsWith("cart") && req.method == "PUT") {
      return next(req)
    }
    _NgxSpinnerService.show("enter-cart")

    return next(req).pipe(finalize(() => {
      setTimeout(() => {

        _NgxSpinnerService.hide("enter-cart")
      }, 1000);
    }))
  }
};
