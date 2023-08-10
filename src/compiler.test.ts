import { describe, expect, it } from "@jest/globals"
import { read } from "./reader"
import { compile } from "./compiler"
import { readFile } from "../os/file-reader"

const compileCode = (code) => {
  const readTokens = read(code)
  console.log('ReadTokens: ', readTokens)
  return compile(readTokens)
}

describe(compile.name, () => {
  it("constant number", () => {
    expect(compileCode("10")).toEqual("10")
  })

  it("constant float", () => {
    expect(compileCode("10.12")).toEqual("10.12")
  })

  it("constant string", () => {
    expect(compileCode(`"hello"`)).toEqual(`hello`)
  })

  it("constant number in multiple line", () => {
    expect(compileCode(`10\n10`)).toEqual(`10\n10`)
  })

  it("variable definition", () => {
    expect(compileCode("(define x 10)")).toEqual(`let x = 10`)
  })

  it("builtin constant", () => {
    expect(compileCode(`PI`))
      .toEqual(`3.141592653589793`)
  })

  it("builtin function", () => {
    expect(compileCode(`sum`))
      .toEqual(`const sum = (n) => n.reduce((acc, curr) => acc + curr, 0)`)
  })

  it("builtin function calling", () => {
    expect(compileCode(`(sum 1 2)`))
      .toEqual(`const sum = (n) => n.reduce((acc, curr) => acc + curr, 0)\nsum(1,2)`)
  })

  it("variable definition with expression", () => {
    expect(compileCode(`(define x (sum 1 2))`))
      .toEqual(`const sum = (n) => n.reduce((acc, curr) => acc + curr, 0)\nlet x = sum(1,2)`)
  })

  it("variable definition with expression as symbol", () => {
    expect(compileCode(`(define (join "v" "2") 1)`))
      .toEqual(`let v2 = 1`)
  })

  it.only("procedure definition", () => {
    expect(compileCode(`
    (define plusTen 
      (lambda (x) (sum 10 x)))`))
      .toEqual(`const plusTen = (x) => {
        return sum(10 x)
      }`)
  })

  it.skip("compile factorial.zark", () => {
    const tokens = read(readFile("factorial.zark"))
    expect(compile(tokens)).toEqual(`const factorial = (n) => {
let acc = n
while(n < 2) {
  n = n - 1
  acc = acc * n
}
return acc
    }`)
  })
})