import { Expression, AST_Token } from "./token"

export const read = (text: string) => generateAST(tokenize(text))

export const tokenize = (code: string): string[] => {
  const parenthesesRegex = /^[\(\)]/
  const symbolRegex = /^\d*[a-zA-Z\-!?+]+/
  const numberRegex = /^-?\d+/
  const unusedCharacters = /^./

  const regexes = [
    parenthesesRegex,
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

export const generateAST = (tokens: string[]): Expression => {
  if (tokens.length === 0) return []

  const token = tokens.shift()!

  if (token === ")")
    throw new Error("Unexpected )")

  if (token === "(") {
    const list: AST_Token[] = []

    while (tokens[0] !== ")")
      list.push(generateAST(tokens) as any)

    tokens.shift()
    return list
  }

  if (/^-?\d+$/.test(token))
    return { type: "number", value: parseInt(token) }

  return { type: "symbol", value: token }
}

