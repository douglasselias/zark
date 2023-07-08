const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b)
const even = (value: number) => (value & 1) === 0

export const builtinEnv = {
  "+": sum, sum,
  "even?": (value: number) => (value & 1) === 0,
  even,
}

export type Env = {
  [key: string]: any
  outer: Env | null
}

export const createEnv = (parms: string[] = [], args: any[] = [], outer: Env | null = null): Env => {
  const env: Env = { outer }
  // env.outer = outer // user can override!!!
  parms.forEach((param, index) => {
    env[param] = args[index]
  })
  return env
}

export const findValue = (env: Env, varName: string): Env | null => {
  if (varName in env) return env[varName]
  if (env.outer) return findValue(env.outer, varName)
  return null
}
