import { describe, expect, it } from "@jest/globals"

import { read, tokenize } from "./reader"
import { evaluate } from "./evaluator"
import { expressionToString } from "./printer"

const interpreter = (code) => expressionToString(evaluate(read(code)))

describe("integration tests", () => {
  it("sum two numbers", () => {
    expect(interpreter("(sum 1 2)")).toEqual("3")
  })

  it("defines a value and sum by itself", () => {
    expect(interpreter("(define x 2)")).toEqual("2")
    expect(interpreter("(sum x x)")).toEqual("4")
  })

  it("defines a procedure and calls it", () => {
    interpreter("(define 1+ (lambda (n) (sum n 1)))")
    expect(interpreter("(1+ 10)")).toEqual("11")
  })

  it("evaluates PI", () => {
    expect(interpreter("PI")).toEqual("3.141592653589793")
  })

  it("evaluates sub-expression", () => {
    expect(interpreter("(sum 1 2 (sum 3 4))")).toEqual("10")
  })

  it("define with sub-expression", () => {
    expect(interpreter("(define x (sum 1 9))")).toEqual("10")
  })

  it("creates procedure and calls it", () => {
    expect(interpreter("((lambda (a) (sum a 3)) 7)")).toBe("10")
  })

  it("call even? expression", () => {
    expect(interpreter("(even? 1)")).toBe("false")
  })

  it("call if expression", () => {
    expect(interpreter("(if (eq 10 10) 100 50)")).toBe("100")
  })

  it("call if expression -> false", () => {
    expect(interpreter("(if (eq 10 1) 100 50)")).toBe("50")
  })

  it("(atom? 1)", () => {
    expect(interpreter("(atom? 1)")).toBe("true")
  })

  it("creates a list", () => {
    expect(interpreter("(list 1 2)")).toBe("(1 2)")
  })

  it("(atom? (list 1 2))", () => {
    expect(interpreter("(atom? (list 1 2))")).toBe("false")
  })

  it("(define x 1) (atom? x)", () => {
    interpreter("(define x 1)")
    expect(interpreter("(atom? x)")).toBe("true")
  })

  it("(atom? non-existent-symbol)", () => {
    expect(interpreter("(atom? non-existent-symbol)")).toBe("false")
  })

  it("(car (list 1 2))", () => {
    expect(interpreter("(car (list 1 2))")).toEqual("1")
  })

  it("(car)", () => {
    expect(() => interpreter("(car)")).toThrow()
  })

  it("eval expression", () => {
    expect(interpreter("(eval (sum 1 2))")).toEqual("3")
  })

  it("quote shorthand symbol", () => {
    expect(interpreter("(q PI)")).toEqual("PI")
  })

  it.skip("eval quoted shorthand symbol", () => {
    expect(interpreter("(eval (q PI))")).toEqual("3.141592653589793")
  })

  it("eval quoted symbol", () => {
    expect(interpreter("(eval (q PI))")).toEqual("3.141592653589793")
  })

  it.skip("eval quote shorthand", () => {
    expect(interpreter("(eval (q (sum 1 2)))")).toEqual("3")
  })

  it("eval quote", () => {
    expect(interpreter("(eval (q (sum 1 2)))")).toEqual("3")
  })

  it("quasiquote without unquote", () => {
    expect(interpreter("(qq (sum 1 2))")).toEqual("(sum 1 2)")
  })

  it("quasiquote with unquote", () => {
    expect(interpreter("(qq (uq (sum 1 2)))")).toEqual("(3)")
  })

  it("append strings", () => {
    expect(interpreter(`(join "vec" "2")`)).toEqual("vec2")
  })

  it("define with join", () => {
    interpreter(`(define (join "vec" "2") 10)`)
    expect(interpreter("(sum 2 vec2)")).toEqual("12")
  })

  // "(sum 2 vec2" -> missing paren at end!

  // it.only("tokenize", () => {
  //   console.log(tokenize("(sum 2 vec2"))
  // })

  // it("define-macro", () => {
  //   interpreter(`
  //   (macro media-flash (lambda x)
  //   (qq (do 
  //     (define vec(uq x)-sum 1)
  //     (define vec(uq x)-mul 2)
  //     (define vec(uq x)-div 3)
  //     (define vec(uq x)-sub 4))))
  //   `)
  //   interpreter("(do (media-flash 2) (media-flash 3))")
  //   expect().toEqual("")
  // })

  it("do block", () => {
    expect(interpreter(`
    (do
      (define gravity 9)
      (define force 1)
      (sum gravity force))
    `)).toEqual("10")
  })

  it("calls cdr", () => {
    expect(interpreter("(cdr (list 1 2 3))")).toEqual("(2 3)")
  })

  it("throws cdr", () => {
    expect(() => interpreter("(cdr 1 2)")).toThrow()
  })

  it("even procedure", () => {
    expect(interpreter("(even? 10)")).toBe("true")
  })

  it("(even? 1)", () => {
    expect(interpreter("(even? 1)")).toBe("false")
  })

  it("call eq procedure with true result", () => {
    expect(interpreter("(eq 10 10)")).toBe("true")
  })

  it("call eq procedure with false result", () => {
    expect(interpreter("(eq 2 1)")).toEqual("false")
  })

  it("call set procedure", () => {
    interpreter("(define z 10)")
    expect(interpreter("z")).toEqual("10")
    interpreter("(set z 20)")
    expect(interpreter("z")).toEqual("20")
  })

  it("call set procedure and throws error", () => {
    interpreter("(define z 10)")
    expect(() => interpreter("(set y 20)")).toThrow()
  })
})