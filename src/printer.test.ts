import { describe, expect, it } from "@jest/globals"
import { printExpression } from "./printer"
import { createNumberToken, createSymbolToken } from "./token"

describe(printExpression.name, () => {
  it.skip("nil", () => {
    // expect(printExpression(null)).toEqual("nil")
  })

  it("true", () => {
    expect(printExpression(true)).toEqual("true")
  })

  it("false", () => {
    expect(printExpression(false)).toEqual("false")
  })

  it("single number", () => {
    expect(printExpression(10)).toEqual("10")
  })

  it("single symbol", () => {
    expect(printExpression("pi")).toEqual("pi")
  })

  it("single procedure sum", () => {
    const sum = () => { }
    expect(printExpression(sum)).toEqual(`#<procedure(${sum.name})>`)
  })

  it("nested expression", () => {
    expect(printExpression(
      ["sum", 1, 2,
        ["*", 3, 4]]
    )).toEqual("(sum 1 2 (* 3 4))")
  })
})