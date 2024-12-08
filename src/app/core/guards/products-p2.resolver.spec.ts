import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { productsP2Resolver } from './products-p2.resolver';

describe('productsP2Resolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => productsP2Resolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
