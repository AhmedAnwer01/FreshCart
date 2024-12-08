import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  if (localStorage.getItem('userToken') !== null) {

    if (req.url.includes('cart') || req.url.includes("wishlist") || req.url.includes("orders") ) {

      req = req.clone({
        setHeaders: { token: localStorage.getItem('userToken')! }
      })


    }
  }


  return next(req);
};
