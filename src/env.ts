// import { readFile } from "../os/file-reader"

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b)
const even = (value: number) => (value & 1) === 0

const mathProperties = Object.getOwnPropertyNames(Math)

export const builtinEnv = {
  "+": sum, sum,
  "even?": (value: number) => (value & 1) === 0,
  even,
  anon: (a) => { return a + 1 },
  eq: (v: any[]) => v[0] === v[1],
  // "load-file":(a:any[])=> readFile(a[0])
}
for (const propertyName of mathProperties) {
  builtinEnv[propertyName] = Math[propertyName]
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

export const findEnv = (env: Env, varName: string): Env | null => {
  if (varName in env) return env
  if (env.outer) return findEnv(env.outer, varName)
  return null
}
