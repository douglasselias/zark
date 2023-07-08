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

  it.only("nested expression", () => {
    expect(evalRead("(+ 1 2 (+ 3 4))")).toBe(10)
  })

  it.skip("define expression", () => {
    expect(evalRead("(def! r 10)")).toBe(10)
  })

  it.skip("define expression with computation", () => {
    expect(evalRead("(def! y (+ 1 7))")).toBe(8)
    expect(evalRead("y")).toBe(8)
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