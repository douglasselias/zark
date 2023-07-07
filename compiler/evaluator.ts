import { readFile } from '../os/file-reader'
import { createEnv, setValueOnCurrentEnv, getValueOnEnv, globalBindings, findEnv } from './env'
import { Token, read } from './reader'

export const evaluate = (exp, env) => {
  if (isSymbol(exp)) return builtinEnv[exp.value]
  if (isNum(exp)) return exp.value

  const proc = evaluate(car(exp), env)
  const args = evalList(cdr(exp), env)
  return proc(args)
}

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b)
export const builtinEnv = { '+': sum, sum }

const isSymbol = (exp) => isAtom(exp) && exp.type === "symbol"
const isNum = (token: Token) => isAtom(token) && token.type === "number"
const isAtom = (token) => !Array.isArray(token)

const evalList = (exps: Token[], env) => exps.map(exp => evaluate(exp, env))
const car = (exp: any) => exp[0]

const cdr = (exp: any) => exp.slice(1)




//// -- LEGACY
export const _evaluate = (expression: any, env) => {
  // console.log('EXP: ', expression)

  if (typeof expression === 'symbol') {
    const symbolName = symbolToString(expression)

    const constants: Record<string, number> = { PI: Math.PI, pi: Math.PI }
    if (symbolName in constants) return constants[symbolName]

    const value = getValueOnEnv(env, symbolName)

    if (!value)
      throw new Error(`Unknown name: ${symbolName}`)
    return value
  }

  if (Array.isArray(expression) && expression.length > 0) {
    const [procedureNameSymbol, ...args] = expression as [any, ...any]
    // console.log('PROC: ', procedureNameSymbol)
    const procSymbol = Array.isArray(procedureNameSymbol) ? procedureNameSymbol[0] : procedureNameSymbol
    const procedureName = symbolToString(procSymbol) // it can be anonymous

    if (procedureName === 'quote') {
      return args[0]
    }

    if (procedureName === 'load-file') {
      return _evaluate(read(readFile(args[0])), env)
    }

    if (procedureName === 'eval') {
      return _evaluate(args[0], env)
    }

    if (procedureName === 'def!') {
      const [name, value] = args as [Symbol, any]
      return setValueOnCurrentEnv(env, symbolToString(name), _evaluate(value, env))
      // return name.toUpperCase() // common lisp returns this
    }

    if (procedureName === 'let*') {
      const lexicalEnv = createEnv({}, env)

      const [symbols, values] = args
      for (let i = 0; i < symbols.length; i += 2) {
        const key = symbols[i], value = symbols[i + 1]
        setValueOnCurrentEnv(lexicalEnv, symbolToString(key), evaluate(value, lexicalEnv))
      }

      return _evaluate(values, lexicalEnv)
    }

    if (procedureName === 'if') {
      const [predicate, trueExpression, falseExpression] = args
      if (_evaluate(predicate, env))
        return _evaluate(trueExpression, env)
      return _evaluate(falseExpression, env)
    }

    if (procedureName === 'fn*') {
      // console.log('ARGS: ', procedureNameSymbol, args, expression)
      const [_fn_, symbols, body] = Array.isArray(procedureNameSymbol)
        ? procedureNameSymbol
        : [null, args, null]

      const anonFn = ((...binds) => {
        const lexicalEnv = createEnv({}, env)

        for (let i = 0; i < symbols.length; i++) {
          const symbol = symbols[i]
          const value = binds[i]
          setValueOnCurrentEnv(lexicalEnv, symbolToString(symbol), value)
        }

        return _evaluate(body, lexicalEnv)
      })

      if (Array.isArray(procedureNameSymbol))
        return anonFn(...args)

      return anonFn
    }

    // if (typeof procedureName === 'symbol') {
    //   // console.log('SYM: ', procedureName)
    // }

    const procedure = getValueOnEnv(env, procedureName)
    if (procedure)
      return procedure(args.map(arg => _evaluate(arg, env)))
    throw new Error('Function not found: ' + procedureName)
  }

  // if (typeof expression[0] === 'function') {
  //   return (expression as any).call(this, ...(expression as any).slice(1))
  // }

  return expression
}

const symbolToString = (symbol: Symbol): string => !symbol ? '#<anonymous-function>' : symbol.toString().replace('Symbol(', '').replace(')', '')