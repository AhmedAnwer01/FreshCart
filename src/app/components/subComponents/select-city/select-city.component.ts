import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const EGYPT_CITIES: string[] = [
  "Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez", "Mansoura",
  "Tanta", "Ismailia", "Faiyum", "Zagazig", "Asyut", "Sohag", "Minya", "Beni Suef",
  "Qena", "Aswan", "Damanhur", "Luxor", "Damietta", "Arish", "Hurghada", "Sharm El-Sheikh", "القاهرة",
  "الإسكندرية",
  "الجيزة",
  "شبرا الخيمة",
  "بورسعيد",
  "السويس",
  "المُنصورة",
  "طنطا",
  "الإسماعيلية",
  "الفيوم",
  "زقازيق",
  "أسيوط",
  "سوهاج",
  "المنيا",
  "بني سويف",
  "قنا",
  "أسوان",
  "دمنهور",
  "الأقصر",
  "دمياط",
  "العريش",
  "الغردقة",
  "شرم الشيخ"
];

@Component({
  selector: 'app-select-city',
  standalone: true,
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.css'],
  imports: [ReactiveFormsModule, CommonModule, TranslateModule]
})
export class SelectCityComponent implements OnInit {
  cityForm !: FormGroup;
  filteredCities: string[] = EGYPT_CITIES;

  @Output() cityChanged = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.cityForm = this.fb.group({
      city: ['', [RxwebValidators.required(), RxwebValidators.oneOf({ matchValues: EGYPT_CITIES, message: 'City must be one of the options' })]]
    });


  }
  ngDoCheck(): void {
    this.cityForm.get('city')?.valueChanges.subscribe(value => {
      this.cityChanged.emit(value);
    })
  }

  filterCities() {
    const searchTerm = this.cityForm.get('city')?.value;
    this.cd.detectChanges()

    if (searchTerm) {
      this.filteredCities = EGYPT_CITIES.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredCities = EGYPT_CITIES;
    }
  }

  selectCity(city: string) {
    this.cityForm.get('city')?.setValue(city);
    this.filteredCities = [];
  }

  onInputFocus() {
    this.filterCities();
  }
}
