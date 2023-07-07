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