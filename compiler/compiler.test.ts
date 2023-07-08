import { describe, expect, it } from "@jest/globals"
import { read } from "./reader"
import { compile } from "./compiler"

describe(compile.name, () => {
  it.skip("variable definition", () => {
    const exp = read("(define x 10)")
    const compiled = ["const x = 10"].join("\n")

    expect(compile(exp)).toBe(compiled)
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
})