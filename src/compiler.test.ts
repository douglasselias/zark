import { describe, expect, it } from "@jest/globals"
import { read } from "./reader"
import { compile } from "./compiler"
import { readFile } from "../os/file-reader"

describe(compile.name, () => {
  it("variable definition", () => {
    const exp = read("(define x 10)")
    const compiled = ["const x = 10"].join("\n")

    expect(compile(exp)).toEqual(compiled)
  })

  it.only("builtin function", () => {
    const exp = read("(sum 1 2)")
    const compiled = ["const sum = (a, b) => a + b", "sum(1,2)"].join("\n")
    expect(compile(exp)).toEqual(compiled)
  })

  it("variable definition with expression", () => {
    const exp = read("(define x (sum 10 10))")
    const compiled = ["const x = sum(10, 10)"].join("\n")

    expect(compile(exp)).toBe(compiled)
  })

  it("procedure definition", () => {
    const exp = read("(define plus-ten (lambda (x) (sum 10 x)))")

    const compiled = [
      "const plus-ten = (x) => {",
      "return sum(10 x)",
      "}"
    ].join("\n")

    expect(compile(exp)).toBe(compiled)
  })

  it("compile factorial.zark", () => {
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