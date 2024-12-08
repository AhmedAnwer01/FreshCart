import { ImageModalComponent } from './../subComponents/image-modal/image-modal.component';
import { Component, inject, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../../core/services/cart.service';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';
import { Direction } from 'readline';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgbRatingModule, NgxImageZoomModule, MatDialogModule, CurrencyPipe, TranslateModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailsComponent implements OnInit, OnDestroy {
  constructor(public dialog: MatDialog) { }

  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ProductsService = inject(ProductsService)
  private readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  readonly _TranslateService = inject(TranslateService)


  zoomedImg !: string
  product: IProduct | null = null
  isLoading: boolean = false
  getProductByIdSubscribe !: Subscription
  paramMapSubscribe !: Subscription
  productId !: string | null
  dir !: any
  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((res) => {
      // console.log(res);
      this.product = res['resolver']['data']
    })
  }
  ngDoCheck(): void {
    this.dir = this._NgxTranslateService.dir
  }
  ariaValueText(current: number, max: number) {
    return `${current} out of ${max} hearts`;
  }
  toastr!: ActiveToast<any>

  addToCart(id: string): void {

    this.isLoading = true
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        CartService.cartCount.next(res.numOfCartItems)

        this.isLoading = false
        this.toastr = this._ToastrService.success(this._TranslateService.instant("success.addedToCart"),
          this._TranslateService.instant("header.freshCart"))
        this.toastr.onTap.subscribe({
          next: () => {
            this._Router.navigate(["/cart"])
          }
        })
      }
    })
  }
  zoomToImg(imgUrl: string) {
    this.zoomedImg = imgUrl
  }
  openImageModal() {
    this.dialog.open(ImageModalComponent, {
      data: { imageUrl: this.zoomedImg },
      width: '80%',
      height: '80%'
    });
  }
  ngOnDestroy(): void {
    this.paramMapSubscribe?.unsubscribe()
  }
}
