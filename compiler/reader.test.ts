import { describe, expect, it } from '@jest/globals'
import { tokenize, readTokens } from './reader'

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

describe('readTokens', () => {
  it('no tokens', () => {
    expect(readTokens([])).toEqual([])
  })

  it('single atom', () => {
    expect(readTokens(['10'])).toEqual(10)
  })

  it('single atom', () => {
    expect(readTokens(['pi'])).toEqual('pi')
  })

  it.skip('multiple atoms', () => {
    expect(readTokens(['10', 'pi'])).toEqual([10, 'PI'])
  })

  it('single empty expression', () => {
    expect(readTokens(['(', ')'])).toEqual([])
  })

  it('single parenthesis', () => {
    expect(readTokens(['('])).toEqual([])
  })

  it('single right parenthesis', () => {
    expect(() => readTokens([')'])).toThrowError()
  })

  it('single expression', () => {
    expect(readTokens(['(', '1', '2', ')'])).toEqual([1, 2])
  })

  it('nested expression', () => {
    expect(readTokens(['(', '+', '1', '2',
      '(', '*', '3', '4', ')', ')'])).toEqual(['+', 1, 2, ['*', 3, 4]])
  })

  it('nested expression', () => {
    expect(readTokens(['(', 'sum', '1', '2',
      '(', 'prod', '3', '4', ')', ')'])).toEqual(['sum', 1, 2, ['prod', 3, 4]])
  })

  it('expression with variable/symbol', () => {
    expect(readTokens(['(', 'list', '1', '2', ')'])).toEqual
      (['list', 1, 2])
  })

  it('expression with string', () => {
    expect(readTokens(['(', 'append', 'hello ', 'world', ')'])).toEqual
      (['append', 'hello ', 'world'])
  })
})