import { Expression, AST_Token } from "./token"

export const read = (text: string) => generateAST(tokenize(text))

export const tokenize = (code: string): string[] => {
  const parenthesesRegex = /^[\(\)]/
  const floatRegex = /^-?\d+\.\d+/
  const symbolRegex = /^\d*[a-zA-Z0-9\-!?+]+/
  const numberRegex = /^-?\d+/
  const stringRegex = /^"[\w\s\.]+"/
  const unusedCharacters = /^./

  const regexes = [
    parenthesesRegex,
    floatRegex,
    symbolRegex,
    numberRegex,
    stringRegex,
    unusedCharacters,
  ].map(regex => regex.source).join("|")

  const joinedRegexes = new RegExp(regexes)
  // console.log('REGEX: ',joinedRegexes.source)
  const tokens: string[] = []
  let remainingCode = code.trimStart()

  while (remainingCode.length !== 0) {
    const [match] = joinedRegexes.exec(remainingCode)!
    // console.log('CODE:', remainingCode.trim())
    // console.log('M:', match)
    tokens.push(match)
    remainingCode = remainingCode.slice(match.length).trimStart()
  }

  return ["(", "do", ...tokens, ")", "__EOF__"]
  // return (tokens.concat("__EOF__"))
}

export const generateAST = (tokens: string[]): Expression => {
  // console.log('Tokens: ', tokens)
  if (tokens.length === 0) return []

  const token = tokens.shift()!
  // console.log('TOK: ', token)

  if (token === ")")
    throw new Error("Unexpected )")

  if (token === "(") {
    const list: AST_Token[] = []

    while (tokens[0] !== ")") {
      if(tokens[0] === "__EOF__") throw new Error("Missing end parenthesis!")
      list.push(generateAST(tokens) as any)
    }

    tokens.shift()
    return list
  }

  if (/^-?\d+$/.test(token))
    return { type: "number", value: parseInt(token) }

  if (/^-?\d+\.\d+$/.test(token))
    return { type: "float", value: parseFloat(token) }

  if (/^"[\w\s\.]+"$/.test(token))
    return { type: "string", value: token.replace(/\"/g, "") }

  return { type: "symbol", value: token }
}

