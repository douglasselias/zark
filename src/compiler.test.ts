import { describe, expect, it } from "@jest/globals"
import { read } from "./reader"
import { compile } from "./compiler"

describe.skip(compile.name, () => {
  it("variable definition", () => {
    const exp = read("(define x 10)")
    const compiled = ["const x = 10"].join("\n")

    expect(compile(exp)).toBe(compiled)
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
})