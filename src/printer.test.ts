import { describe, expect, it } from "@jest/globals"
import {  print,printExpression } from "./printer"

describe(print.name, () => {
  expect(print(true)).toEqual(undefined)
})

describe(printExpression.name, () => {
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