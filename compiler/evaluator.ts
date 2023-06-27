export const evaluate = (expression: Expression, env = defaultEnv) => {
  if (typeof expression === 'symbol') {
    const symbolName = symbolToString(expression)

    const constants: Record<string, number> = { PI: Math.PI, pi: Math.PI }
    if (symbolName in constants) return constants[symbolName]
    if (symbolName in env) return env[symbolName]

    throw new Error(`Unknown name: ${symbolName}`)
  }

  if (Array.isArray(expression)) {
    const [procedureNameSymbol, ...args] = expression as [any, ...any]
    const procedureName = symbolToString(procedureNameSymbol)

    if (procedureName === 'define') {
      const [name, value] = args as [string, any]
      env[name] = evaluate(value, env)
      return name.toUpperCase()
    }

    if (procedureName in env) {
      const procedure = env[procedureName] // is function?
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

export const defaultEnv: Record<string, Function> = {
  '+': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  '*': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  '-': (numbers: number[]) => numbers.reduce((a, b) => a - b),
  '/': (numbers: number[]) => numbers.reduce((a, b) => a / b),
  'append': (strings: string[]) => strings.reduce((a, b) => a + b),
  // 'define': (name: string, value: any, env: any) => env[name] = value,
}

const symbolToString = (symbol: Symbol): string => symbol.toString().replace('Symbol(', '').replace(')', '')