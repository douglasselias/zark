import { describe, expect, it } from '@jest/globals'
import { read } from './reader'
import { evaluate } from './evaluator'
import { globalBindings, createEnv } from './env'

const globalEnv = createEnv(globalBindings)
const evalWithEnv = (exp) => evaluate(read(exp), globalEnv)

describe.skip('evaluate', () => {
  it('no expressions', () => {
    expect(evalWithEnv('')).toEqual([])
  })

  it('single atom', () => {
    expect(evalWithEnv('10')).toEqual(10)
  })

  it('single atom', () => {
    expect(evalWithEnv('PI')).toBeCloseTo(3.141592653589793)
  })

  it.skip('single expression', () => {
    // should throw error, function call
    expect(evalWithEnv(['(', '1', '2', ')'])).toEqual(1)
  })

  it('nested expression', () => {
    expect(evalWithEnv('(+ 1 2 (* 3 4))')).toBe(15)
  })

  it('define expression', () => {
    expect(evalWithEnv('(def! r 10)')).toBe(10)
  })

  it('define expression with computation', () => {
    expect(evalWithEnv('(def! y (+ 1 7))')).toBe(8)
    expect(evalWithEnv('y')).toBe(8)
  })

  it('define lexical scope', () => {
    expect(evalWithEnv('(let* (z 9) z)')).toBe(9)
  })
    
  it('define lexical scope 2', () => {
    expect(evalWithEnv('(let* (p (+ 2 3) q (+ 2 p)) (+ p q))')).toBe(12)
  })

  it('define lexical scope 3', () => {
    expect(evalWithEnv('(let* (r 10) (* pi (* r r)))')).toBeCloseTo(314.1592653589793)
  })

  it('define lexical scope 4', () => {
    expect(evalWithEnv('(def! y (let* (z 7) z))')).toBe(7)
  })

  it('calls outer scope values', () => {
    expect(evalWithEnv('(def! a 4)')).toBe(4)
    expect(evalWithEnv('(let* (q (+ 10 a)) a)')).toBe(4)
  })

  it.skip('creates procedure', () => {
    expect(evalWithEnv('(fn* (a) a)')).toBe('#<function>')
  })

  it('creates procedure and calls it', () => {
    expect(evalWithEnv('((fn* (a) a) 7)')).toBe(7)
  })
    
  it('creates procedure and calls it', () => {
    expect(evalWithEnv('((fn* (a) (+ a 1)) 10)')).toBe(11)
  })

  it('creates procedure and calls it with two arguments', () => {
    expect(evalWithEnv('((fn* (a b) (+ a b)) 2 3)')).toBe(5)
  })
})