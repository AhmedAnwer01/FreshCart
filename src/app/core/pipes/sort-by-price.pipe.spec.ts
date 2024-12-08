import { SortByPricePipe } from './sort-by-price.pipe';

describe('SortByPricePipe', () => {
  it('create an instance', () => {
    const pipe = new SortByPricePipe();
    expect(pipe).toBeTruthy();
  });
});
