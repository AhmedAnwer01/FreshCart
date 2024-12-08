import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  private readonly _CategoriesService = inject(CategoriesService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  allCategories !: ICategory[]
  searchedCategory: string = ""

  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((res) => {
      this.allCategories = res['resolver']['data']
    })
  }

  searchCategories(searchedCategory: string): ICategory[] {
    return this.allCategories?.filter((category) => {
      return category.name.toLowerCase().includes(searchedCategory.toLowerCase())
    })
  }

}
