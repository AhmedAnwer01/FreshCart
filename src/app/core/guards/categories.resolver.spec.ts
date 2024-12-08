import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { categoriesResolver } from './categories.resolver';

describe('categoriesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => categoriesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
