const { log } = console

export const tokenize: Tokenize = (code) => {
  const parenthesisRegex = /^[\(\)]/
  const symbolRegex = /^\d*[a-zA-Z!-]+/
  const numberRegex = /^-?\d+/
  const unusedCharacters = /^./
  // const stringRegex = /^"[\w\s]+"/

  const regexes = [
    parenthesisRegex,
    symbolRegex,
    numberRegex,
    unusedCharacters,
  ]
  const joinedRegexes = joinRegexes(regexes)

  const tokens: any[] = []
  let remainingCode = code.trimStart()

  while (remainingCode.length !== 0) {
    const result = joinedRegexes.exec(remainingCode)
    if (result !== null) {
      const [match] = result
      tokens.push(match)
      remainingCode = remainingCode.slice(match.length).trimStart()
    }
  }

  return tokens
}

const joinRegexes = (regexes: RegExp[]) => {
  const pattern = regexes.map(regex => regex.source).join("|")
  return new RegExp(pattern)
}

export const readTokens = (tokens: string[]): Token | Token[] => {
  if (tokens.length === 0) return []

  const token = tokens.shift()!

  if (token === ')')
    throw new Error('Unexpected )')

  if (token === '(') {
    const list: Token[] = []

    while (tokens[0] !== ')')
      list.push(readTokens(tokens) as any)

    tokens.shift()
    return list
  }

  return readAtom(token)
}

const readAtom = (token: string): Token => {
  if (/^-?\d+/.test(token))
    return { type: "number", value: parseInt(token) }
  // if (/^\d*[a-zA-Z!-]+/.test(token))
  return { type: "symbol", value: token }
}


type Tokenize = (sourceCode: string) => string[]
// type AST = string[]

export type Token = {
  type: TokenTypes
  value: number | string
  // lexeme: string
  // literal: any
  // line: number
  // col: number
}

type TokenTypes =
  | 'number'
  | 'symbol'

const convertTokenToSymbol = () => { }
const convertTokenToAtom = () => { }

export const read = (text: string) => readTokens(tokenize(text))
///////////////////////////////////////// LEGACY


// export const _tokenize = (input: string): string[] => {
//   const regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g
//   const tokens = []

//   while (true) {
//     const matches = regexp.exec(input)
//     if (!matches) break // unreachable code?

//     const match = matches[1]
//     if (match === '') break
//     if (match[0] !== ';') tokens.push(match)
//   }

//   return tokens
// }

// export const _readTokens = (tokens: string[]): Expression => {
//   if (tokens.length === 0) return []

//   const token = tokens.shift()

//   if (token === '(') {
//     const list: Expression = []

//     while ([undefined, ')'].notIncludes(tokens[0]))
//       list.push(readTokens(tokens))

//     tokens.shift()
//     return list
//   }

//   if (token === ')')
//     throw new Error('Unexpected )')

//   // if (token === '\'') 
//   // return // quote

//   // if (token === '`')
//   // return // quasiquote

//   return _readAtom(token)
// }

// const _readAtom = (token: string): number | string | boolean | Symbol => {
//   if (/^-?\d+$/.test(token)) return parseInt(token)
//   if (/^-?[0-9]\.[0-9]+$/.test(token)) return parseFloat(token)
//   if (/^"(?:\\.|[^\\"])*"$/.test(token)) return token.slice(1, token.length - 1)
//   if (token === 't') return true
//   if (token === 'nil') return false
//   return Symbol(token)
// }


declare global {
  type Expression = number | string | boolean | Symbol | Expression[]
  // interface Array<T> {
  //   notIncludes(value: T): boolean
  // }
}

// Array.prototype.notIncludes = function (value) {
//   return !this.includes(value)
// }