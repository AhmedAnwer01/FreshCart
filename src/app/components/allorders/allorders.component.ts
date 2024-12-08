import { Component, inject, OnInit } from '@angular/core';
import { Iorder } from '../../core/interfaces/iorder';
import { OrdersService } from '../../core/services/orders.service';
import { ShippingComponent } from '../shipping/shipping.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortByPipe } from '../../core/pipes/sort-by.pipe';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [ShippingComponent, DatePipe, CurrencyPipe, FormsModule, SortByPipe, TranslateModule],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
  providers: [ShippingComponent]
})
export class AllordersComponent implements OnInit {
  private readonly _OrdersService = inject(OrdersService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  ordersCount !: number
  allOrders !: Iorder[]
  selectedFilter: "Latest" | "Oldest" = "Latest"

  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((res) => {
      // console.log(res)
      this.allOrders = res['resolver']
      // console.log(this.allOrders)
      this.ordersCount = this.allOrders.length

      for (let i = 0; i < this.ordersCount; i++) {
        this.allOrders[i].index = i + 1;
      }
    });
  }
}
