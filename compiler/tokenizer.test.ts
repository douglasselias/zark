import { describe, expect, it } from '@jest/globals'
import { tokenize } from './tokenizer'

describe('tokenize', () => {
  it('no expression', () => {
    expect(tokenize('')).toEqual([])
  })

  describe('incomplete expression', () => {
    it('single left parenthesis', () => {
      expect(tokenize('(')).toEqual(['('])
    })

    it('single right parenthesis', () => {
      expect(tokenize(')')).toEqual([')'])
    })
    
    it('unmatching left parenthesis', () => {
      expect(tokenize('(()')).toEqual(['(', '(', ')'])
    })

    it('unmatching right parenthesis', () => {
      expect(tokenize('())')).toEqual(['(', ')', ')'])
    })
  })

  it('single expression', () => {
    expect(tokenize('(+ 1 2)')).toEqual(['(', '+', '1', '2', ')'])
  })

  it('nested expression', () => {
    expect(tokenize('(+ 1 2 (* 3 4))')).toEqual
      (['(', '+', '1', '2',
        '(', '*', '3', '4', ')', ')'])
  })

  it('nested expression in new line', () => {
    expect(tokenize(`
    (+ 1 2 
      (* 3 4))
      `)).toEqual
      (['(', '+', '1', '2',
        '(', '*', '3', '4', ')', ')'])
  })

  it('multiple expressions', () => {
    expect(tokenize('(+ 1 2) (* 3 4)')).toEqual
      (['(', '+', '1', '2', ')',
        '(', '*', '3', '4', ')'])
  })
})