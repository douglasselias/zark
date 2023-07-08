import { describe, expect, it } from "@jest/globals"
import { read } from "./reader"
import { evaluate } from "./evaluator"

const evalRead = (exp: string) => evaluate(read(exp))

describe(evaluate.name, () => {
  it("single number", () => {
    expect(evalRead("10")).toEqual(10)
  })

  it.skip("single symbol", () => {
    expect(evalRead("PI")).toBeCloseTo(3.141592653589793)
  })

  it.skip("single expression", () => {
    // should throw error, function call
    expect(() => evalRead("(1 2)")).toThrow()
  })

  it("nested expression", () => {
    expect(evalRead("(+ 1 2 (+ 3 4))")).toBe(10)
  })

  it("define expression", () => {
    expect(evalRead("(define x 10)")).toBe(10)
  })

  it("define expression with sub-expression", () => {
    expect(evalRead("(define x (sum 1 9))")).toBe(10)
  })

  it("define value and call expression with value", () => {
    evalRead("(define x 3)")
    expect(evalRead("(sum x 7)")).toBe(10)
  })

  it("creates procedure and calls it", () => {
    expect(evalRead("((lambda (a) (sum a 3)) 7)")).toBe(10)
  })

  it("creates procedure and calls it with expression", () => {
    expect(evalRead("((lambda (a) (sum a 3)) (sum 5 2))")).toBe(10)
  })

  it("defines procedure and call later with value", () => {
    evalRead("(define sum-one (lambda (n) (sum n 1)))")
    expect(evalRead("(sum-one 9)")).toBe(10)
  })

  it("defines procedure and call later with value 2", () => {
    evalRead("(define 1+ (lambda (n) (sum n 1)))")
    expect(evalRead("(1+ 9)")).toBe(10)
  })


  it.skip("define lexical scope", () => {
    expect(evalRead("(let* (z 9) z)")).toBe(9)
  })
    
  it.skip("define lexical scope 2", () => {
    expect(evalRead("(let* (p (+ 2 3) q (+ 2 p)) (+ p q))")).toBe(12)
  })

  it.skip("define lexical scope 4", () => {
    expect(evalRead("(def! y (let* (z 7) z))")).toBe(7)
  })

  it.skip("calls outer scope values", () => {
    expect(evalRead("(def! a 4)")).toBe(4)
    expect(evalRead("(let* (q (+ 10 a)) a)")).toBe(4)
  })

  it.skip("creates procedure", () => {
    expect(evalRead("(fn* (a) a)")).toBe("#<function>")
  })

  it.skip("creates procedure and calls it", () => {
    expect(evalRead("((fn* (a) a) 7)")).toBe(7)
  })
    
  it.skip("creates procedure and calls it", () => {
    expect(evalRead("((fn* (a) (+ a 1)) 10)")).toBe(11)
  })

  it.skip("creates procedure and calls it with two arguments", () => {
    expect(evalRead("((fn* (a b) (+ a b)) 2 3)")).toBe(5)
  })
})