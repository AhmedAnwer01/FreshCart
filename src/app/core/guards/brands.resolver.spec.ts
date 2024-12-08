import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { brandsResolver } from './brands.resolver';

describe('brandsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => brandsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
