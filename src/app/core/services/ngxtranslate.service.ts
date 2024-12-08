import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NgxTranslateService {

  dir !: string
  private readonly _TranslateService = inject(TranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  // private readonly _Renderer2 = inject(Renderer2) In component
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(null, null) // in service
  constructor() {

    /*
    1- Get local lang
    2- Set Default lang
    3- use local lang
    */
    if (isPlatformBrowser(this._PLATFORM_ID)) {

      this._TranslateService.setDefaultLang("en")

      let lang = localStorage.getItem("lang")

      this.setLang()
    }

  }
  setLang() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      let lang = localStorage.getItem("lang")
      if (localStorage.getItem("lang")) {
        this._TranslateService.use(lang!)
      } else {
        this._TranslateService.use(this._TranslateService.defaultLang)
      }

      if (lang === "en") {
        // ltr
        this.dir = "ltr"
        this._Renderer2.setAttribute(document.documentElement, 'dir', this.dir)
        this._Renderer2.setAttribute(document.documentElement, 'lang', lang)
        // document.documentElement.dir = "ltr"

      } else if (lang === "ar") {
        // rtl
        this.dir = "rtl"
        this._Renderer2.setAttribute(document.documentElement, 'dir', this.dir)
        this._Renderer2.setAttribute(document.documentElement, 'lang', lang)
        // document.documentElement.dir = "rtl"
      }
    }
  }

  changeLang(lang: string) {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      localStorage.setItem("lang", lang)
      this.setLang()
    }
  }
}
