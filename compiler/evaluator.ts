import { createEnv, setValueOnCurrentEnv, getValueOnEnv, globalBindings, findEnv } from './env'

export const evaluate = (expression: Expression, env) => {
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
    const procedureName = symbolToString(procedureNameSymbol)

    if (procedureName === 'def!') {
      const [name, value] = args as [Symbol, any]
      return setValueOnCurrentEnv(env, symbolToString(name), evaluate(value, env))
      // return name.toUpperCase() // common lisp returns this
    }

    if (procedureName === 'let*') {
      const lexicalEnv = createEnv({}, env)
      console.log('Lexical Env: ', lexicalEnv)
      console.log('Args:', args)

      const lets = args[0]
      for (let i = 0; i < lets.length; i += 2) {
        const key = lets[i], value = lets[i + 1]
        setValueOnCurrentEnv(lexicalEnv, symbolToString(key), evaluate(value, lexicalEnv))
      }

      return evaluate(args[1], lexicalEnv)
    }

    const procedure = getValueOnEnv(env, procedureName) // is function?
    if (procedure) {
      const mappedArgs: any[] = args.map(arg => evaluate(arg, env))
      return procedure(mappedArgs)
    }

    throw new Error('Function not found: ' + procedureName)

    // if (procedureName === 'begin') {
    //   return args.reduce((acc, curr) => { evaluate(curr, acc); return acc }, env)
    // }
  }

  return expression
}

const symbolToString = (symbol: Symbol): string => symbol.toString().replace('Symbol(', '').replace(')', '')