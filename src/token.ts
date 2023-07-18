export type Expression = EvaluatedToken | (EvaluatedToken | EvaluatedToken[])[]
export type EvaluatedToken = NumberToken | SymbolToken | BoolToken | ProcedureToken

export type AST = AST_Token | (AST_Token | AST_Token[])[]
export type AST_Token = NumberToken | SymbolToken

export type NumberToken = {
  type: "number"
  value: number
}

type SymbolToken = {
  type: "symbol"
  value: string
}

type ProcedureToken = {
  type: "procedure"
  value: Function
}

export type BoolToken = {
  type: "bool" 
  value: boolean
}
