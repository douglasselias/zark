import { describe, expect, it } from '@jest/globals'
import { readTokens } from './token-reader'

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