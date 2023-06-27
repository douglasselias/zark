import { describe, expect, it } from '@jest/globals'
import { simpleTokenize, tokenize } from './tokenizer'

describe('simple tokenize', () => {
  it('no expression', () => {
    expect(simpleTokenize('')).toEqual([])
  })

  describe('incomplete expression', () => {
    it('single left parenthesis', () => {
      expect(simpleTokenize('(')).toEqual(['('])
    })

    it('single right parenthesis', () => {
      expect(simpleTokenize(')')).toEqual([')'])
    })

    it('unmatching left parenthesis', () => {
      expect(simpleTokenize('(()')).toEqual(['(', '(', ')'])
    })

    it('unmatching right parenthesis', () => {
      expect(simpleTokenize('())')).toEqual(['(', ')', ')'])
    })
  })

  it('single expression', () => {
    expect(simpleTokenize('(+ 1 2)')).toEqual(['(', '+', '1', '2', ')'])
  })

  it('nested expression', () => {
    expect(simpleTokenize('(+ 1 2 (* 3 4))')).toEqual
      (['(', '+', '1', '2',
        '(', '*', '3', '4', ')', ')'])
  })

  it('nested expression in new line', () => {
    expect(simpleTokenize(`
    (+ 1 2 
      (* 3 4))
      `)).toEqual
      (['(', '+', '1', '2',
        '(', '*', '3', '4', ')', ')'])
  })

  it('multiple expressions', () => {
    expect(simpleTokenize('(+ 1 2) (* 3 4)')).toEqual
      (['(', '+', '1', '2', ')',
        '(', '*', '3', '4', ')'])
  })

  it('expression with variable/symbol', () => {
    expect(simpleTokenize('(list 1 2)')).toEqual
      (['(', 'list', '1', '2', ')'])
  })

  it.skip('expression with string', () => {
    expect(simpleTokenize('(append "hello " "world")')).toEqual
      (['(', 'append', '"hello "', '"world"', ')'])
  })
})

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