import { describe, expect, it } from "@jest/globals"
import { tokenize, readTokens } from "./reader"
import { createNumberToken, createSymbolToken } from "./token"

describe(tokenize.name, () => {
  it("single number", () => {
    const number = 1234567890
    expect(tokenize(`  ${number}  `)).toEqual([String(number)])
  })

  it("single symbol", () => {
    const fn = "sum"
    expect(tokenize(`  ${fn}  `)).toEqual([fn])
  })

  it("single unused character", () => {
    const char = "+"
    expect(tokenize(`  ${char}  `)).toEqual([char])
  })

  it("multiple unused characters", () => {
    const char = "+="
    expect(tokenize(`  ${char}  `)).toEqual(char.split(""))
  })

  it("unmatching right parenthesis", () => {
    const exp = "())"
    expect(tokenize(exp)).toEqual(exp.split(""))
  })

  it("single symbol with special characer", () => {
    expect(tokenize("even?")).toEqual(["even?"])
  })

  it("single expression", () => {
    expect(tokenize("(sum 1 2)")).toEqual(["(", "sum", "1", "2", ")"])
  })

  it("nested expression in new line", () => {
    expect(tokenize(`
    (sum 1 2 
      (list 3 4))
      (list 
        10 20)
      `)).toEqual([
      "(", "sum", "1", "2",
      "(", "list", "3", "4", ")", ")",
      "(", "list", "10", "20", ")"
    ])
  })
})

describe(readTokens.name, () => {
  it("no tokens", () => {
    expect(readTokens([])).toEqual([])
  })

  it("single number", () => {
    expect(readTokens(["10"])).toEqual(createNumberToken(10))
  })

  it("single symbol", () => {
    expect(readTokens(["pi"])).toEqual(createSymbolToken("pi"))
  })

  it("unmatching right parenthesis", () => {
    expect(() => readTokens([")"])).toThrow()
  })

  it("nested expression", () => {
    expect(readTokens([
      "(", "sum", "1", "2",
      "(", "*", "3", "4", ")", ")"])).toEqual([
        createSymbolToken("sum"),
        createNumberToken(1),
        createNumberToken(2),
        [createSymbolToken("*"),
        createNumberToken(3),
        createNumberToken(4)]
      ])
  })
})
