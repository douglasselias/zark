import fs from 'fs'

const { log } = console

const file = fs.readFileSync('sample.zk').toString()

enum TokenType {
  // Single char tokens
  LEFT_PAREN, RIGHT_PAREN,
  PLUS,
  EQUAL,
  // Multiple char tokens
  SLASH, SLASH_EQUAL,
  LESS, LESS_EQUAL,
  GREATER, GREATER_EQUAL,
  // Literals
  IDENTIFIER, NUMBER,
  // Keywords
  PRINT, IF,

  EOF,
}

type Token = {
  type: TokenType
  lexeme: string
  literal: any
  line: number
}

const tokenToString = ({ type, lexeme, literal }: Token): string => {
  return `${type}, ${lexeme}, ${literal}`
}

const lexer = (code: string) => {
  return 0
}

const scanner = (source: string) => {
  let start = 0, current = 0, line = 1,
    tokens: Token[] = []

  const advance = () => source.charAt(current++)
  const addToken = (type: TokenType, literal?: any) => {
    const text = source.substring(start, current)
    tokens.push({ type, lexeme: text, literal, line })
  }
  const isAtStart = () => current < source.length

  const match = (expected: string): boolean => {
    if (!isAtStart()) return false;
    if (source.charAt(current) != expected) return false;

    current++;
    return true;
  }

  const scanToken = () => {
    const c = advance()

    switch (c) {
      case '(': addToken(TokenType.LEFT_PAREN); break
      case ')': addToken(TokenType.RIGHT_PAREN); break
      case '+': addToken(TokenType.PLUS); break
      case '=': addToken(TokenType.EQUAL); break
      case '/':
        addToken(match('=') ? TokenType.SLASH_EQUAL : TokenType.SLASH)
        break
      case '<':
        addToken(match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break
      case '>':
        addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
        break
      default: log(line + " Unexpected character"); break
    }
  }

  while (isAtStart()) {
    start = current
    scanToken()
  }

  tokens.push({ type: TokenType.EOF, lexeme: "", literal: null, line })
  return tokens
}

log(file)
log(lexer(file))

