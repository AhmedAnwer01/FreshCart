import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { homeProductsResolver } from './home-products.resolver';

describe('homeProductsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => homeProductsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
