import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { provideToastr } from 'ngx-toastr';
import Swiper from 'swiper';
import { headersInterceptor } from './core/interceptors/headers.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Create Function To Load Files from assets/i18n/

export function HttpLoaderFactory(http: HttpClient) {

  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),

    provideClientHydration(),
    provideAnimationsAsync(),

    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, loadingInterceptor, errorInterceptor])),
    provideToastr({
      toastClass: "ngx-toastr",
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      // progressBar: true,
      // progressAnimation: "decreasing",
      enableHtml: true,
      closeButton: true,
      extendedTimeOut: 3000,
      onActivateTick: true,
      newestOnTop: true,
    }),
    provideAnimations(), // better than importProvidersFrom(BrowserAnimationModule)
    importProvidersFrom(
      RxReactiveFormsModule,
      BrowserAnimationsModule,
      NgxImageZoomModule,
      Swiper,
      NgxSpinnerModule,
      NgxPaginationModule,
      PaginatePipe,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],

        }
      })
    ),
  ],
};
