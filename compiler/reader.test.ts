import { describe, expect, it } from '@jest/globals'
import { tokenize, readTokens } from './reader'

const createToken = (type: string) => (value: string|number) => ({type, value})

const createSymbolToken = createToken("symbol")
const createNumberToken = createToken("number")


describe('tokenize', () => {
  it('single atom', () => {
    const number = 1234567890
    expect(tokenize(` ${number} `)).toEqual([String(number)])
  })

  it('single atom fn name', () => {
    const fn = 'sum'
    expect(tokenize(`   ${fn}   `)).toEqual([fn])
  })

  it('single atom unused character', () => {
    const char = '+'
    expect(tokenize(`   ${char}   `)).toEqual([char])
  })

  it('single atom unused character 2', () => {
    const char = '=='
    expect(tokenize(`   ${char}   `)).toEqual(["=", "="])
  })

  it.skip('no expression', () => {
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
    expect(tokenize('(sum 1 2)')).toEqual(['(', 'sum', '1', '2', ')'])
  })

  it('nested expression', () => {
    expect(tokenize('(sum 1 2 (sum 3 4))')).toEqual
      (['(', 'sum', '1', '2',
        '(', 'sum', '3', '4', ')', ')'])
  })

  it('nested expression in new line', () => {
    expect(tokenize(`
    (sum 1 2 
      (sum 3 4))
      `)).toEqual
      (['(', 'sum', '1', '2',
        '(', 'sum', '3', '4', ')', ')'])
  })

  it('multiple expressions', () => {
    expect(tokenize('(sum 1 2) (sum 3 4)')).toEqual
      (['(', 'sum', '1', '2', ')',
        '(', 'sum', '3', '4', ')'])
  })

  it('expression with variable/symbol', () => {
    expect(tokenize('(list 1 2)')).toEqual
      (['(', 'list', '1', '2', ')'])
  })

  it.skip('expression with string', () => {
    expect(tokenize('(append "hello " "world")')).toEqual
      (['(', 'append', '"hello "', '"world"', ')'])
  })
})

describe('readTokens', () => {
  it.skip('no tokens', () => {
    expect(readTokens([])).toEqual([])
  })

  it('single atom', () => {
    expect(readTokens(['10'])).toEqual(createNumberToken(10))
  })

  it('single atom', () => {
    expect(readTokens(['pi'])).toEqual(createSymbolToken("pi"))
  })

  it.skip('multiple atoms', () => {
    expect(readTokens(['10', 'pi'])).toEqual([10, 'PI'])
  })

  it('single empty expression', () => {
    expect(readTokens(['(', ')'])).toEqual([])
  })

  it.skip('single parenthesis', () => {
    expect(readTokens(['('])).toEqual([])
  })

  it('single right parenthesis', () => {
    expect(() => readTokens([')'])).toThrowError()
  })

  it('single expression', () => {
    expect(readTokens(['(', '1', '2', ')'])).toEqual([createNumberToken(1), createNumberToken(2)])
  })

  it('nested expression', () => {
    expect(readTokens(['(', '+', '1', '2',
      '(', '*', '3', '4', ')', ')'])).toEqual([
        createSymbolToken("+"),
        createNumberToken(1),
        createNumberToken(2),
        [createSymbolToken("*"),
          createNumberToken(3),
          createNumberToken(4)]
      ])
  })

  it.skip('nested expression', () => {
    expect(readTokens(['(', 'sum', '1', '2',
      '(', 'product', '3', '4', ')', ')'])).toEqual(
        [
          {"type": "symbol", "value": "sum"}, { "type": "number", "value": 1 }, { "type": "number", "value": 2 },
          [{"type": "symbol", "value": "product"}, {"type": "number", "value": 3}, { "type": "number", "value": 4 }]
        ])
  })

  it.skip('expression with variable/symbol', () => {
    expect(readTokens(['(', 'list', '1', '2', ')'])).toEqual
      ([{"type": "symbol", "value": "list"}, {"type": "number", "value": 1}, {"type": "number", "value": 2}])
  })

  it.skip('expression with string', () => {
    expect(readTokens(['(', 'append', 'hello ', 'world', ')'])).toEqual
      (['append', 'hello ', 'world'])
  })
})