import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, FormsModule],
  templateUrl: './nav-auth.component.html',
  styleUrl: './nav-auth.component.css'
})
export class NavAuthComponent {
  private readonly _TranslateService = inject(TranslateService)
  private readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  lang!: string

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.lang = localStorage.getItem("lang")
      this._NgxTranslateService.changeLang(this.lang || this._TranslateService.defaultLang)
    }
  }

  switchLang() {
    this._NgxTranslateService.changeLang(this.lang)
  }

}
