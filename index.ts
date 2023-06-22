// import fs from 'fs'
// import readline from 'readline'
import { readTokens } from './compiler/token-reader'
import { tokenize } from './compiler/tokenizer'

const { log } = console

// const reader = readline.createInterface({ input: process.stdin, output: process.stdout, })

// const file = fs.readFileSync('main.zark').toString()

export const defaultEnv: Record<string, Function> = {
  '+': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  '*': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  // 'define': (name: string, value: any, env: any) => env[name] = value,
}

export const parse = (source: string) => readTokens(tokenize(source))

type Expression = number | string | Expression[]

export const evaluate = (expression: Expression, env = defaultEnv) => {
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

// const repl = () => {
//   reader.question('(Zark) * ', input => {
//     log(evaluate(parse(input)))
//     return input === 'exit' ? reader.close() : repl()
//   })
// }

// repl()

// process.exit(0)