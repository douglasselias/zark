import { Token } from "./token"

export const read = (text: string) => readTokens(tokenize(text))

export const tokenize = (code: string): string[] => {
  const parenthesisRegex = /^[\(\)]/
  const symbolRegex = /^\d*[a-zA-Z\-!?+]+/
  const numberRegex = /^-?\d+/
  const unusedCharacters = /^./

  const regexes = [
    parenthesisRegex,
    symbolRegex,
    numberRegex,
    unusedCharacters,
  ].map(regex => regex.source).join("|")

  const joinedRegexes = new RegExp(regexes)
  const tokens: string[] = []
  let remainingCode = code.trimStart()

  while (remainingCode.length !== 0) {
    const [match] = joinedRegexes.exec(remainingCode)!
    tokens.push(match)
    remainingCode = remainingCode.slice(match.length).trimStart()
  }

  return tokens
}

export const readTokens = (tokens: string[]): Token | Token[] => {
  if (tokens.length === 0) return []

  const token = tokens.shift()!

  if (token === ")")
    throw new Error("Unexpected )")

  if (token === "(") {
    const list: Token[] = []

    while (tokens[0] !== ")")
      list.push(readTokens(tokens) as any)

    tokens.shift()
    return list
  }

  return readAtom(token)
}

const readAtom = (token: string): Token => {
  if (/^-?\d+$/.test(token)) return { type: "number", value: parseInt(token) }
  return { type: "symbol", value: token }
}
