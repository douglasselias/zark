export const evaluate = (expression: Expression, env = defaultEnv) => {
  if (typeof expression === 'number') return expression

  if (typeof expression === 'string') {
    const constants: Record<string, number> = { PI: Math.PI, }
    if (expression in constants) return constants[expression]
    if (expression in env) return env[expression]

    // throw new Error(`Unknown name: ${expression}`)
  }

  if (Array.isArray(expression)) {
    const [procedureName, ...args] = expression as [string, ...any]

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

    if (procedureName === 'begin') {
      return args.reduce((acc, curr) => { evaluate(curr, acc); return acc }, env)
    }
  }

  return expression
}

export const defaultEnv: Record<string, Function> = {
  '+': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  '*': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  // 'define': (name: string, value: any, env: any) => env[name] = value,
}