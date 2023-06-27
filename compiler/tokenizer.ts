// doesn't work with strings
export const simpleTokenize = (source: string): string[] =>
  source
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .split(/\s+/g)
    .filter(char => !(/\s+/g.test(char) || char === ''))

export const tokenize = (input: string): string[] => {
  const regexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g
  const tokens = []

  while (true) {
    const matches = regexp.exec(input)
    if (!matches) break // unreachable code?

    const match = matches[1]
    if (match === '') break

    if (match[0] !== ';')
      tokens.push(match)
  }

  return tokens
}