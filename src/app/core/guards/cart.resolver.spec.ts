import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { cartResolver } from './cart.resolver';

describe('cartResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => cartResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
