export type Expression = EvaluatedToken | (EvaluatedToken | EvaluatedToken[])[]
export type EvaluatedToken = NumberToken | FloatToken | SymbolToken | BoolToken | ProcedureToken | StringToken

export type AST = AST_Token | (AST_Token | AST_Token[])[]
export type AST_Token = NumberToken | FloatToken | SymbolToken | StringToken

export type NumberToken = {
  type: "number"
  value: number
}

export type FloatToken = {
  type: "float"
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

export type StringToken = {
  type: "string"
  value: string
}