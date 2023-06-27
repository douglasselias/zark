// let position = 0

// const next = () => { }

// const peek = () => { }

export const readString = (s: string) => {
  return readForm(tokenize(s))
}

const tokenize = (input: string): string[] => {
  const tokensRegex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/
  const matches = tokensRegex.exec(input)
  const tokens = []
  
  for (const match of matches) {
    if (!match) break
    if (match === '') break
    tokens.push(match)
  }

  return tokens
}

const readForm = (tokens: string[]) => {
  const [first, ...rest] = tokens
  switch (first) {
    case '(':
      return readList(rest)
    default:
      return readAtom(first)
  }
}

const readList = (tokens: string[]) => {
  const list = []

  for (const token of tokens) {
    if (!token) throw new Error("Unexpected EOF")
    if (token === ')') break
    list.push(readForm(tokens))
  }

  return list
}
const readAtom = (token) => {
  if (/^\d+$/.test(token)) return parseInt(token)
  return Symbol(token)
 }
