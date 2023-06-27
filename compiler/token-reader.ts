export const readTokens = (tokens: string[]): Expression => {
  if (tokens.length === 0) return []

  const token = tokens.shift()

  if (token === '(') {
    // readList(tokens) // rest
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

const readList = (tokens: string[]) => {
  const list = []

  for (const token of tokens) {
    if (!token) throw new Error("Unexpected EOF")
    if (token === ')') break
    list.push(readTokens(tokens))
  }

  return list
}

const readAtom = (token: string): number | string => {
  if (/\d+/g.test(token)) return parseInt(token)
  return token // Symbol?
}


declare global {
  type Expression = number | string | Expression[]
  interface Array<T> {
    notIncludes(value: T): boolean
  }
}

Array.prototype.notIncludes = function (value) {
  return !this.includes(value)
}