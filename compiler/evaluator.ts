import { readFile } from '../os/file-reader'
import { createEnv, setValueOnCurrentEnv, getValueOnEnv, globalBindings, findEnv } from './env'
import { read } from './reader'


export const evaluate = (expression: Expression, env) => {
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
      return evaluate(read(readFile(args[0])), env)
    }

    if (procedureName === 'eval') {
      return evaluate(args[0], env)
    }

    if (procedureName === 'def!') {
      const [name, value] = args as [Symbol, any]
      return setValueOnCurrentEnv(env, symbolToString(name), evaluate(value, env))
      // return name.toUpperCase() // common lisp returns this
    }

    if (procedureName === 'let*') {
      const lexicalEnv = createEnv({}, env)

      const [symbols, values] = args
      for (let i = 0; i < symbols.length; i += 2) {
        const key = symbols[i], value = symbols[i + 1]
        setValueOnCurrentEnv(lexicalEnv, symbolToString(key), evaluate(value, lexicalEnv))
      }

      return evaluate(values, lexicalEnv)
    }

    if (procedureName === 'if') {
      const [predicate, trueExpression, falseExpression] = args
      if (evaluate(predicate, env))
        return evaluate(trueExpression, env)
      return evaluate(falseExpression, env)
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

        return evaluate(body, lexicalEnv)
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
      return procedure(args.map(arg => evaluate(arg, env)))
    throw new Error('Function not found: ' + procedureName)
  }

  // if (typeof expression[0] === 'function') {
  //   return (expression as any).call(this, ...(expression as any).slice(1))
  // }

  return expression
}

const symbolToString = (symbol: Symbol): string => !symbol ? '#<anonymous-function>' : symbol.toString().replace('Symbol(', '').replace(')', '')