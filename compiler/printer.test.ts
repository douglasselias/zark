import { describe, expect, it } from "@jest/globals"
import { printExpression } from "./printer"
import { createNumberToken, createSymbolToken } from "./token"

describe(printExpression.name, () => {
  it.skip("nil", () => {
    // expect(printExpression(null)).toEqual("nil")
  })

  it.skip("true", () => {
    // expect(printExpression(true)).toEqual("t")
  })

  it.skip("false", () => {
    // expect(printExpression(false)).toEqual("nil")
  })

  it("single number", () => {
    expect(printExpression(createNumberToken(10))).toEqual("10")
  })

  it("single symbol", () => {
    expect(printExpression(createSymbolToken("pi"))).toEqual("pi")
  })

  it("nested expression", () => {
    expect(printExpression(
      [createSymbolToken("sum"), createNumberToken(1), createNumberToken(2),
      [createSymbolToken("*"), createNumberToken(3), createNumberToken(4)]]
    )).toEqual("(sum 1 2 (* 3 4))")
  })
})