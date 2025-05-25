import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SliceTextPipe } from '../../core/pipes/slice-text.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { BestProductsPipe } from '../../core/pipes/best-products.pipe';
import { CartService } from '../../core/services/cart.service';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { NgxTranslateService } from '../../core/services/ngxtranslate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselModule,
    RouterLink,
    SliceTextPipe,
    SearchPipe,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    BestProductsPipe,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor() { }

  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  readonly _TranslateService = inject(TranslateService)
  readonly _NgxTranslateService = inject(NgxTranslateService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)


  // Data
  resultedProducts: IProduct[] = [];
  bestProducts: IProduct[] = []
  allProducts: IProduct[] = [];
  allCategories: ICategory[] = [];

  searchedProduct: string = "";

  isLoading: boolean = false
  autoSearchOn: boolean = false
  dir !: string
  toastr !: ActiveToast<any>

  // Subscriptions
  getAllCategoriesSubscribe!: Subscription;
  getAllProductsSubscribe!: Subscription;

  // Forms
  searchForm: FormGroup = new FormGroup({
    search: new FormControl(this.searchedProduct),
  });

  get search() {
    return this.searchForm.get('search')?.value;
  }
  set search(value: string) {
    this.searchForm.get('search')?.setValue(value);
  }
  queryParams = {
    page: "1"
  }


  ngOnInit(): void {

    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.dir = this._NgxTranslateService.dir
    }
    // Get Categories
    this._ActivatedRoute.data.subscribe((res) => {

      this.allCategories = res['resolver']['data']
      this.allProducts.push(...res['resolverProducts']["data"])
    })

    // Get Products
    this._ProductsService.getAllProducts(this.queryParams).subscribe({
      next: (res) => {
        this.allProducts.push(...res.data);

        this.resultedProducts = this.allProducts
        this.bestProducts = this.allProducts.filter((product) => {
          return product.ratingsQuantity >= 60
        })
      }
    });
  }


  mainCarousel: OwlOptions = {
    loop: true,
    center: true,
    autoplay: true,
    skip_validateItems: false,
    slideTransition: "linear",

    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 500,
    rtl: true,
    responsive: {
      0: {
        items: 1
      }
    },
    items: 1,
    navText: [
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
      '<i class="fa fa-angle-left" aria-hidden="true"></i>'
    ],
    nav: true,
  };


  categoriesCarousel: OwlOptions = {
    loop: true,
    autoplay: true,
    skip_validateItems: false,
    slideTransition: '',
    autoplaySpeed: 1000,
    autoplayHoverPause: true,
    mouseDrag: true,
    // touchDrag: true,
    pullDrag: true,
    rtl: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
      '<i class="fa fa-angle-left" aria-hidden="true"></i>'
    ],

    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 3,
      },
      740: {
        items: 4,
      },
      940: {
        items: 6,
      },
      1400: {
        items: 8,
      },
    },

    nav: true,
  };


  searchProductsAuto() {
    if (this.searchedProduct == "") {
      this.resultedProducts = this.allProducts;
      return
    }
    if (this.autoSearchOn){
      this.resultedProducts = this.allProducts?.filter((product) => {
        return product.title
          .toLowerCase()
          .includes(this.searchedProduct.toLowerCase());
      });
  }
}


searchProducts() {
  this.resultedProducts = this.allProducts?.filter((product) => {
    return product.title
      .toLowerCase()
      .includes(this.searchedProduct.toLowerCase());
  });
}


toggleAutoSearch() {
  this.autoSearchOn = !this.autoSearchOn;
}


addToCart(id: string): void {
  this.isLoading = true
    this._CartService.addProductToCart(id).subscribe({
    next: (res) => {

      CartService.cartCount.next(res.numOfCartItems)
      this.toastr = this._ToastrService.success(this._TranslateService.instant("success.addedToCart"),
        this._TranslateService.instant("header.freshCart"))
      this.toastr.onTap.subscribe({
        next: () => {
          this._Router.navigate(["/cart"])
        }
      })
      this.isLoading = false
    }
  })
}


ngOnDestroy(): void {
  this.getAllProductsSubscribe?.unsubscribe();
  this.getAllCategoriesSubscribe?.unsubscribe();
}

}
