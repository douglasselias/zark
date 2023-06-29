import { describe, expect, it } from '@jest/globals'
import { printExpression } from './printer'

describe('print', () => {
  it('no tokens', () => {
    expect(printExpression([])).toEqual('()')
  })

  it('single atom', () => {
    expect(printExpression(10)).toEqual('10')
  })

  it('nil', () => {
    expect(printExpression(null)).toEqual('nil')
  })

  it('true', () => {
    expect(printExpression(true)).toEqual('t')
  })

  it('false', () => {
    expect(printExpression(false)).toEqual('nil')
  })

  it.skip('single atom', () => {
    expect(printExpression('pi')).toEqual('PI')
  })

  it('single atom/symbol', () => {
    expect(printExpression(Symbol('pi'))).toEqual('Symbol(pi)')
  })

  it.skip('multiple atoms', () => {
    expect(printExpression(['10', 'pi'])).toEqual([10, 'PI'])
  })

  it.skip('single empty expression', () => {
    expect(printExpression(['(', ')'])).toEqual([])
  })

  it.skip('single parenthesis', () => {
    expect(printExpression(['('])).toEqual('()')
  })

  it.skip('single right parenthesis', () => {
    expect(() => printExpression([')'])).toThrowError()
  })

  it('single expression', () => {
    expect(printExpression(['+', '1','2'])).toEqual('(+ 1 2)')
  })

  it.skip('nested expression', () => {
    expect(printExpression(['(', '+', '1', '2',
      '(', '*', '3', '4', ')', ')'])).toEqual(['+', 1, 2, ['*', 3, 4]])
  })

  it.skip('nested expression', () => {
    expect(printExpression(['(', 'sum', '1', '2',
      '(', 'prod', '3', '4', ')', ')'])).toEqual(['SUM', 1, 2, ['PROD', 3, 4]])
  })
})