import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { subCategoriesResolver } from './sub-categories.resolver';

describe('subCategoriesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => subCategoriesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
