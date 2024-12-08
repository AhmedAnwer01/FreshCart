import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { ICart } from '../../core/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { IProduct } from '../../core/interfaces/iproduct';
import { SliceTextPipe } from '../../core/pipes/slice-text.pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { NavBlankComponent } from '../nav-blank/nav-blank.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, SliceTextPipe, RouterLink, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {

  private readonly _CartService = inject(CartService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  cart: ICart = {} as ICart
  checkOutBtn: boolean = true
  isLoading: boolean = false
  cartId !: string

  getProductsCartSubscribe !: Subscription
  deleteProductSubscribe !: Subscription
  updateCartItemCountSubscribe !: Subscription
  clearCartSubscribe !: Subscription

  ngOnInit(): void {

    this._ActivatedRoute.data.subscribe((res) => {
      // console.log(res);

      this.cart = res['resolver']
      // console.log(this.cart);

      this.cartId = this.cart.cartId
      CartService.cartCount.next(this.cart.numOfCartItems)
    })

  }

  removeProduct(id: string): void {

    this.deleteProductSubscribe = this._CartService.deleteProduct(id).subscribe({
      next: (res) => {
        this.cart = res
        CartService.cartCount.next(this.cart.numOfCartItems)
      }
    })
  }

  updateProductCount(id: string, count: number): void {
    if (count > 0) {
      this.checkOutBtn = false
      this.isLoading = true

      this.cart.data.products.forEach((productInfo) => {
        if (productInfo.product.id === id) {
          productInfo.count = count
        }
      })




      this.updateCartItemCountSubscribe = this._CartService.updateCartItemCount(id, count).subscribe({
        next: (res: ICart) => {

          // console.log(res);
          this.checkOutBtn = true
          this.isLoading = false
          this.cart.data.totalCartPrice = res.data.totalCartPrice
        }
      })

    }
  }


  clearCart() {
    this.clearCartSubscribe = this._CartService.clearCart().subscribe({
      next: (res) => {
        this.cart.numOfCartItems = 0
        CartService.cartCount.next(this.cart.numOfCartItems)

      }
    })
  }


  ngOnDestroy(): void {
    this.getProductsCartSubscribe?.unsubscribe()
    this.deleteProductSubscribe?.unsubscribe()
    this.updateCartItemCountSubscribe?.unsubscribe()
    this.clearCartSubscribe?.unsubscribe()

  }
}
