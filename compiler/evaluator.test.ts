import { describe, expect, it } from '@jest/globals'
import { evaluate } from './evaluator'

describe('evaluate', () => {
  it('no expressions', () => {
    expect(evaluate([])).toEqual([])
  })

  it('single atom', () => {
    expect(evaluate(10)).toEqual(10)
  })

  it('single atom', () => {
    expect(evaluate('PI')).toBeCloseTo(3.141592653589793)
  })

  it.skip('single expression', () => {
    // should throw error, function call
    expect(evaluate(['(', '1', '2', ')'])).toEqual(1)
  })

  it('nested expression', () => {
    expect(evaluate(['+', 1, 2,
      ['*', 3, 4]])).toBe(15)
  })

  it('define expression', () => {
    expect(evaluate(['define', 'r', 10])).toBe('R')
  })

  it.skip('define expression and computation', () => {
    expect(evaluate(['begin', ['define', 'r', 10],
      ['*', 'pi', ['*', 'r', 'r']]])).toBeCloseTo(314.15)
  })
})