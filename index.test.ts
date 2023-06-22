import { describe, expect, it } from '@jest/globals';
import { tokenize } from './index';

describe('tokenize', () => {
  it('single expression', () => {
    expect(tokenize('(+ 1 2)')).toEqual(['(','+', '1', '2', ')'])
  })
})