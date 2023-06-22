import fs from 'fs'
import readline from 'readline'

const { log } = console

const reader = readline.createInterface({ input: process.stdin, output: process.stdout, })

const file = fs.readFileSync('main.zark').toString()

const tokenize = (source: string): string[] =>
  source
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .split(/\s+/g)
    .filter(char => !(/\s+/g.test(char) || char === ''))

const readTokens = (tokens: string[]): any[] => {
  if (tokens.length === 0)
    throw new Error('Unexpected EOF')

  const token = tokens.shift()!

  if (token === '(') {
    const list: any[] = []
    while (tokens[0] != ')')
      list.push(readTokens(tokens))
    tokens.shift()
    return list
  }

  if (token === ')')
    throw new Error('Unexpected )')

  return atom(token)
}

const atom = (token: string): any => {
  if (/\d+/g.test(token)) return parseInt(token)
  // if(token === '+') return '+'
  return token
}

const defaultEnv: Record<string, Function> = {
  '+': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  '*': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  // 'define': (name: string, value: any, env: any) => env[name] = value,
}

const parse = (source: string) => readTokens(tokenize(source))

type Expression = number | string | Expression[]

const evaluate = (expression: Expression, env = defaultEnv) => {
  if (typeof expression === 'number') return expression

  if (typeof expression === 'string') {
    const constants: Record<string, number> = { PI: Math.PI, }
    if (expression in constants) return constants[expression]
    if (expression in env) return env[expression]
    
    throw new Error(`Nome desconhecido: ${expression}`)
  }

  if (Array.isArray(expression)) {
    const [procedureName, ...args] = expression as [string, ...any]

    if (procedureName in env) {
      const procedure = env[procedureName] // is function?
      const mappedArgs: any[] = args.map(arg => evaluate(arg, env))
      return procedure(mappedArgs)
    }

    if (procedureName === 'define') {
      const [name, value] = args as [string, any]
      env[name] = value
    }
  }

  return expression
}

// log(tokenize(file))
// log(readFromTokens(tokenize(file)))

// log(evaluate(parse(file)))
// log(evaluate(parse('(+ 1 2)')))
// log(evaluate(parse('(+ 1 2 (+ 3 4))')))
// log(evaluate(parse('(+ 1 2 (* 3 4))')))
// log(evaluate(parse('(begin (define r 10) (* r r))')))
// log(evaluate(parse('(define r 10) (* r r)')))



const repl = () => {
  reader.question('(Zark) * ', input => {
    log(evaluate(parse(input)))
    return input === 'exit' ? reader.close() : repl()
  })
}

repl()

// process.exit(0)