const createToken = (type: TokenTypes) => (value: TokenValues): Token => ({ type, value })
export const createNumberToken = createToken("number")
export const createSymbolToken = createToken("symbol")

export type Expression = Token | (Token|Token[])[]

export type Token = {
  type: TokenTypes
  value: TokenValues
}

export type TokenTypes =
  | "number"
  | "symbol"

type TokenValues = number | string
