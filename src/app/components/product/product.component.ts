import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectorRef } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SliceTextPipe } from '../../core/pipes/slice-text.pipe';
import { CurrencyPipe } from '@angular/common';
import { ToastrService, ActiveToast } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { FilterCategoriesPipe } from '../../core/pipes/filter-categories.pipe';
import { SubCategoriesService } from '../../core/services/sub-categories.service';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IPagination } from '../../core/interfaces/ipagination';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, SearchPipe,
    RouterLink,
    SliceTextPipe,
    SearchPipe,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    FilterCategoriesPipe,
    NgxPaginationModule,
    TranslateModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductComponent {
  private readonly _ProductsService = inject(ProductsService)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _SubCategoriesService = inject(SubCategoriesService);
  private readonly _ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly _PaginationService = inject(PaginationService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  readonly _TranslateService = inject(TranslateService)


  allProducts !: IProduct[]
  resultedProducts !: IProduct[]
  allCategories !: ICategory[]
  searchedProduct: string = ""
  selectedCategory: string = ""
  isLoading: boolean = false
  catId !: string
  productResponse !: any
  availableCategoriesNames: string[] = ["Men's Fashion", "Women's Fashion", "Electronics"]
  availableCategories !: ICategory[]
  pagination: IPagination = {} as IPagination
  priceSort: string = ""
  pageNumber !: number
  pageProductsLimit: string = "30"
  queryParams = {
    page: "1",
    limit: this.pageProductsLimit,
    sort: "",

  }
  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((res) => {
      this.productResponse = res['resolverP1']
      this.allProducts = res['resolverP1']['data']
      this.pagination = res['resolverP1']?.metadata
      this.pagination.totalItems = res['resolverP1']?.results

      this.allProducts?.push(...res['resolverP2']['data'])
      this.pagination.data = this.allProducts
      this.resultedProducts = this.allProducts
      // console.log(this.allProducts);


    })

    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories = res.data
        this.allCategories.forEach((category) => {
          category.disabled = true
        })
        this.availableCategories = this.allCategories.filter(category => this.availableCategoriesNames.includes(category.name));
        this.availableCategories.forEach((category) => {
          category.disabled = false
        })
      }
    })

  }

  filterByCategory() {
    this.resultedProducts = this.allProducts.filter((product) => {
      return product.category.name.startsWith(this.selectedCategory)
    })

    this.pagination.data = this.resultedProducts
    this.pagination.numberOfPages = Math.ceil(this.resultedProducts.length / +this.pageProductsLimit)
  }

  pageChanged(pageNumber: number) {
    this.pagination.currentPage = pageNumber
    this.queryParams.page = this.pagination.currentPage.toString()
    if (this.selectedCategory != "") {
      // this.pagination.numberOfPages = Math.ceil(this.resultedProducts.length / +this.pageProductsLimit)

    } else {

      this._ProductsService.getAllProducts(this.queryParams).subscribe({
        next: (res) => {
          this.resultedProducts = res.data
          this.pagination = res.metadata
          this.pagination.totalItems = res.results
          this.pagination.data = res.data

          this.resultedProducts = this.resultedProducts.filter((product: IProduct) => {
            return product.category.name.startsWith(this.selectedCategory)
          })
        }
      })
    }

  }

  sortByPrice() {
    let sortedArray = []
    if (this.priceSort == "lowest") {
      this.queryParams.sort = 'price'
    } else if (this.priceSort == "highest") {
      this.queryParams.sort = '-price'
    } else {
      this.queryParams.sort = ''
    }
    this.queryParams.page = "1"

    this._ProductsService.getAllProducts(this.queryParams).subscribe({
      next: (res) => {
        sortedArray.push(...res.data)
        this.pagination = res.metadata


      }
    })
    this._ProductsService.getAllProducts({

      page: "2",
      limit: this.pageProductsLimit,
      sort: this.queryParams.sort,
    }).subscribe({
      next: (res) => {
        sortedArray.push(...res.data)

        this.resultedProducts = sortedArray.filter((product) => {
          return product.category.name.startsWith(this.selectedCategory)
        })

      }
    })

  }

  searchProducts(): void {
    this.resultedProducts = SearchPipe.prototype.transform(this.allProducts, this.searchedProduct) || [];
  }

  toastr!: ActiveToast<any>
  addToCart(id: string): void {
    this.isLoading = true
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {

        CartService.cartCount = res.numOfCartItems

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
}
