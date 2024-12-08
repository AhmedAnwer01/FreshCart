import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCityComponent } from './select-city.component';

describe('SelectCityComponent', () => {
  let component: SelectCityComponent;
  let fixture: ComponentFixture<SelectCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
