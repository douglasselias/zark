export const read = (text: string) => readTokens(tokenize(text))

export const tokenize = (input: string): string[] => {
  const regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g
  const tokens = []

  while (true) {
    const matches = regexp.exec(input)
    if (!matches) break // unreachable code?

    const match = matches[1]
    if (match === '') break
    if (match[0] !== ';') tokens.push(match)
  }

  return tokens
}

export const readTokens = (tokens: string[]): Expression => {
  if (tokens.length === 0) return []

  const token = tokens.shift()

  if (token === '(') {
    const list = []

    while ([undefined, ')'].notIncludes(tokens[0]))
      list.push(readTokens(tokens))

    tokens.shift()
    return list
  }

  if (token === ')')
    throw new Error('Unexpected )')

  return readAtom(token)
}

const readAtom = (token: string): number | string | boolean | Symbol => {
  if (/^-?\d+$/.test(token)) return parseInt(token)
  if (/^-?[0-9]\.[0-9]+$/.test(token)) return parseFloat(token)
  if (/^"(?:\\.|[^\\"])*"$/.test(token)) return token.slice(1, token.length - 1)
  if (token === 't') return true
  if (token === 'nil') return false
  return Symbol(token)
}


declare global {
  type Expression = number | string | boolean | Symbol | Expression[]
  interface Array<T> {
    notIncludes(value: T): boolean
  }
}

Array.prototype.notIncludes = function (value) {
  return !this.includes(value)
}