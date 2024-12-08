import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { allordersResolver } from './allorders.resolver';

describe('allordersResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => allordersResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
