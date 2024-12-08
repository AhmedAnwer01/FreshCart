import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Ibrand } from '../../core/interfaces/ibrand';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit, OnDestroy {

  private readonly _BrandsService = inject(BrandsService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  allBrands: Ibrand[] = []
  searchedBrand: string = ""


  getAllBrandsSubscribe !: Subscription

  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((res) => {

      this.allBrands.push(...res['resolver']?.data)
      this.allBrands.push(...res['resolverP2']?.data)
      // console.log(this.allBrands);
    })
  }

  searchBrands(searchedBrand: string): Ibrand[] {
    return this.allBrands.filter((brand) => {
      return brand.name.toLowerCase().includes(searchedBrand.toLowerCase())
    })
  }

  ngOnDestroy(): void {
    this.getAllBrandsSubscribe?.unsubscribe()
  }
}
