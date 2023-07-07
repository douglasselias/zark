export type Token = {
  type: TokenTypes
  value: number | string
}

export type TokenTypes =
  | "number"
  | "symbol"