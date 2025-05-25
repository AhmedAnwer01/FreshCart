import { Component, inject, OnInit } from '@angular/core';
import { SelectCityComponent } from "../subComponents/select-city/select-city.component";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { NgClass } from '@angular/common';
import { minLength, RxFormBuilder, RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShippingAddress } from '../../core/interfaces/shipping-address';
import { ShippingInfo } from '../../core/interfaces/shipping-info';
import { OrdersService } from '../../core/services/orders.service';
import { Iorder } from '../../core/interfaces/iorder';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [SelectCityComponent, NgxIntlTelInputModule, NgClass, RxReactiveFormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'

})
export class ShippingComponent implements OnInit {


  private readonly _RxFormBuilder = inject(RxFormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _OrdersService = inject(OrdersService)

  phoneValueChangesSubscribe !: Subscription | undefined
  emailValueChangesSubscribe !: Subscription | undefined


  allOrders: Iorder[] = []
  shippingInfo !: ShippingInfo;
  shippingAddress !: ShippingAddress
  shippingDetails: string = ""
  cartId: string | null = null
  selectedCity: string | null = null;
  submitDisabled: boolean = false

  shippingForm: FormGroup = this._RxFormBuilder.group({

    firstName: ['', [RxwebValidators.required(), RxwebValidators.maxLength({ value: 15 }), RxwebValidators.minLength({ value: 3 })]],
    lastName: ['', [RxwebValidators.required(), RxwebValidators.maxLength({ value: 15 }), RxwebValidators.minLength({ value: 3 })]],
    email: ['', [RxwebValidators.required(), RxwebValidators.email()]],
    phone: ['', [RxwebValidators.required()]],
    address: ['', [RxwebValidators.required(), RxwebValidators.maxLength({ value: 200 }), minLength({ value: 10 })]],
    city: [''],
    country: ["Egypt"]
  })


  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get("id")
      }
    })
  }

  onCityChanged(city: string) {
    this.selectedCity = city;
    this.shippingForm.get("city")?.setValue(this.selectedCity)
  }


  ngDoCheck(): void {

    this.shippingInfo = this.shippingForm.value
    this.shippingInfo.phone = this.shippingForm.get("phone")?.value?.nationalNumber?.replace(" ", "")


    this.shippingDetails = `
    firstName: ${this.shippingInfo?.firstName} 
    lastName: ${this.shippingInfo?.lastName} 
    email: ${this.shippingInfo?.email}
    country: ${this.shippingInfo?.country} 
    city: ${this.shippingInfo?.city} 
    address: ${this.shippingInfo?.address}
    `

    this.shippingAddress = {
      'shippingAddress': {
        'details': this.shippingDetails,
        'phone': this.shippingInfo?.phone?.toString(),
        'city': this.shippingInfo?.city
      }
    }
    if (this.shippingForm.valid) {
      this.submitDisabled = false
    }
  }

  submitShippingAddress(): void {
    this.shippingForm.markAllAsTouched()

    if (this.shippingForm.valid) {
      this._OrdersService.checkOutSession(this.shippingAddress, this.cartId).subscribe({
        next: (res) => {
          window.open(res.session.url, "_self")
        }
      })
    } else {
      this.submitDisabled = true
    }
  }

  createOrder(): void {
    this._OrdersService.createOrder(this.cartId, this.shippingAddress).subscribe({
      next: (res) => {
        this.allOrders.push(res.data)
      }
    })
  }
}
