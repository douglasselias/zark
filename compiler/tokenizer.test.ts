import { describe, expect, it } from '@jest/globals'
import { tokenize } from './reader'

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

  it('expression with variable/symbol', () => {
    expect(tokenize('(list 1 2)')).toEqual
      (['(', 'list', '1', '2', ')'])
  })

  it('expression with string', () => {
    expect(tokenize('(append "hello " "world")')).toEqual
      (['(', 'append', '"hello "', '"world"', ')'])
  })
})