import { readFile } from '../os/file-reader'
import { createEnv, setValueOnCurrentEnv, getValueOnEnv, globalBindings, findEnv } from './env'
import { Token, read } from './reader'

export const evaluate = (exp:Token| Token[], env) => {
  const token = Array.isArray(exp) ? exp[0] : exp
  console.log('EVAL: EXP: ', exp)
  if (isNum(token)) return token.value
  return apply(car(exp), evlis(cdr(exp), env), env)
}

const apply = (fn: Token, args: Token[], env) => {
  // const _fn = symbolToString(fn)
  // console.log('FN: ', _fn)
  if (builtin(fn)) return applyBuiltin(fn, args)
  // if (function_(_fn)) return eval_(caddr(_fn), extend(args, cadddr(_fn), env))
  return console.error(`Função inválida ${fn.value}`)
}

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b)
const builtinEnv = { '+': sum, sum }
const builtin = (t: Token) => builtinEnv[t.value] !== undefined
const applyBuiltin = (fn: Token, args: Token[]) => builtinEnv[fn.value](args.map(token => token.value))

const isNum = (token: Token) => token.type === "number"

const evlis = (exps: Token[], env) => exps.map(exp => evaluate(exp, env))
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