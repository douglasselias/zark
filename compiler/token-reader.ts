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

  return atom(token)
}

const atom = (token: string): number | string => {
  if (/\d+/g.test(token)) return parseInt(token)
  return token.toUpperCase()
}

type Expression = number | string | Expression[]

declare global {
  interface Array<T> {
    notIncludes(value: T): boolean
  }
}

Array.prototype.notIncludes = function (value) {
  return !this.includes(value)
}