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
  it.only("constant value", () => {
    expect(compileCode("10")).toEqual("10")
  })

  it.only("constant value in multiple line", () => {
    expect(compileCode(`10\n10`)).toEqual(`10\n10`)
  })

  it.only("variable definition", () => {
    expect(compileCode("(define x 10)")).toEqual(`let x = 10`)
  })

  it("builtin function", () => {
    const exp = read("(sum 1 2)")
    const compiled = ["const sum = (a, b) => a + b", "sum(1,2)"].join("\n")
    expect(compile(exp)).toEqual(compiled)
  })

  it.skip("variable definition with expression", () => {
    const exp = read("(define x (sum 10 10))")
    const compiled = ["const x = sum(10, 10)"].join("\n")

    expect(compile(exp)).toBe(compiled)
  })

  it.skip("procedure definition", () => {
    const exp = read("(define plus-ten (lambda (x) (sum 10 x)))")

    const compiled = [
      "const plus-ten = (x) => {",
      "return sum(10 x)",
      "}"
    ].join("\n")

    expect(compile(exp)).toBe(compiled)
  })

  it.skip("compile factorial.zark", () => {
    const tokens = read(readFile("factorial.zark"))
    //     (define factorial (lambda (n)
    //   (do 
    //     (define acc n)
    //     (while (less-than n 2)
    //       (do 
    //         (set n (sub n 1))
    //         (set acc (mul acc n))))
    //     acc)))

    // (factorial 6)
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