import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISubCategory } from '../../core/interfaces/sub-category';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css'
})
export class SubCategoriesComponent {
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _CategoriesService = inject(CategoriesService)
  category: ICategory = {} as ICategory
  categoryId !: string
  subCategories: ISubCategory[] = []
  searchedSubCategory: string = ""
  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((res) => {
      this.subCategories = res['resolver'].data
      // console.log(this.subCategories);

      this._ActivatedRoute.paramMap.subscribe((params) => {
        this.categoryId = params.get("categoryId")
        this._CategoriesService.getCategoryById(this.categoryId).subscribe((res) => {
          // console.log("category", res);
          this.category = res.data

        })
      })

    })
  }

  searchSubCategories(): ISubCategory[] {
    return this.subCategories.filter((subCategory: ISubCategory) => {
      return subCategory.name.toLowerCase().includes(this.searchedSubCategory.toLowerCase())
    })
  }
}
