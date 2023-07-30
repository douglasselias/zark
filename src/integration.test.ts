import { describe, expect, it } from "@jest/globals"

import { generateAST, read, tokenize } from "./reader"
import { evaluate } from "./evaluator"
import { expressionToString } from "./printer"

const interpreter = (code) => expressionToString(evaluate(read(code)))

describe("integration tests", () => {
  it("empty program - throws", () => {
    expect(() => interpreter("")).toThrow()
  })

  it("throws on single right paren", () => {
    expect(() => interpreter(")")).toThrow()
  })

  it("sum two numbers", () => {
    expect(interpreter("(sum 1 2)")).toEqual("3")
  })

  it("sum two numbers (floats)", () => {
    expect(interpreter("(sum 1.23 2.52)")).toEqual("3.75")
  })

  it("divide three numbers", () => {
    expect(interpreter("(div 12 3 2)")).toEqual("2")
  })

  it("subtract three numbers", () => {
    expect(interpreter("(sub 10 3 2)")).toEqual("5")
  })

  it("multiply three numbers", () => {
    expect(interpreter("(mul 10 3 2)")).toEqual("60")
  })

  it("greater than", () => {
    expect(interpreter("(greater-than 0 10)")).toEqual("false")
  })

  it("less than", () => {
    expect(interpreter("(less-than 1 2)")).toEqual("true")
  })

  it("load file", () => {
    const result = interpreter(`(eval (load-file "factorial.zark"))`)
    // console.error("loaded file: ", JSON.stringify(result, null, 2))
    expect(result).toEqual(`6`)
  })

  it("multiple expressions", () => {
    expect(interpreter(`(define x 1)
    (define y 2)`)).toEqual("2")
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

  it("eval quoted symbol", () => {
    expect(interpreter("(eval (q PI))")).toEqual("3.141592653589793")
  })

  it("eval quote shorthand", () => {
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

  it("throw on missing parenthesis at end of form", () => {
    expect(() => interpreter("(sum 1 2")).toThrow()
  })

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

  it("while block", () => {
    interpreter(`(define factorial (lambda (n)
    (do 
      (define acc n)
      (while (greater-than n 2)
        (do 
          (set n (sub n 1))
          (set acc (mul acc n))))
      acc)))`) // this can work without acc at the end, since while returns the last value
    expect(interpreter("(factorial 6)")).toEqual("720")
  })

  describe("to string", () => {
    it("number", () => {
      expect(interpreter("(to-string 10)")).toEqual("10") // hmm
    })

    it("list", () => {
      expect(interpreter("(to-string (list 1 2 3))")).toEqual("(1 2 3)") // hmm
    })
  })

  describe("to number", () => {
    it("string", () => {
      expect(interpreter(`(to-number "10")`)).toEqual("10") // hmm
    })
  })

  it("head", () => { 
    expect(interpreter(`(head (list 1 2 3))`)).toEqual("1")
  })

  it("tail", () => { 
    expect(interpreter(`(tail (list 1 2 3))`)).toEqual("(2 3)")
  })

  it("map list", () => { 
    interpreter("(define add-one (lambda (n) (sum n 1)))")
    expect(interpreter(`(map add-one (list 1 2 3))`)).toEqual("(2 3 4)")
  })

  it("size", () => { 
    expect(interpreter(`(size (list 1 2 3))`)).toEqual("3")
  })

  it("is-list", () => { 
    expect(interpreter(`(is-list (list 1 2 3))`)).toEqual("true")
    expect(interpreter(`(is-list "hello")`)).toEqual("false")
  })

  it("is-number", () => { 
    expect(interpreter(`(is-number 10)`)).toEqual("true")
    expect(interpreter(`(is-number "10")`)).toEqual("false")
  })

  it("is-string", () => { 
    expect(interpreter(`(is-string 10)`)).toEqual("false")
    expect(interpreter(`(is-string "10")`)).toEqual("true")
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
    expect(() => interpreter("(set non-existent-symbol 20)")).toThrow()
  })
})