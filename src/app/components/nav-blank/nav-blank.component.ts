import { ApplicationRef, ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CartService } from '../../core/services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, TranslateModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent {
  private readonly _AuthenticationService = inject(AuthenticationService)
  private readonly _CartService = inject(CartService)
  private readonly _TranslateService = inject(TranslateService)
  private readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)

  cartCount !: number;
  lang!: string
  dir!: string
  cartCountSubscription !: Subscription;
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.lang = localStorage.getItem("lang")
      this._NgxTranslateService.changeLang(this.lang || this._TranslateService.defaultLang)
    }
    this.cartCountSubscription = CartService.cartCount.subscribe((count) => {
      this.cartCount = count
    })
  }
  ngDoCheck(): void {
    this.dir = this._NgxTranslateService.dir
  }


  switchLang() {
    this._NgxTranslateService.changeLang(this.lang)
  }

  signOut() {
    this._AuthenticationService.signOut();
  }
  ngOnDestroy(): void {
    this.cartCountSubscription?.unsubscribe()
  }
}
