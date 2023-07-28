// import { readFile } from "../os/file-reader"

import { NumberToken, AST_Token, EvaluatedToken, BoolToken, StringToken } from "./token"

const sum = (numbers: NumberToken[]): NumberToken => ({
  type: "number",
  value: numbers.reduce((total, current) => current.value + total, 0)
})

const even = (number: NumberToken[]): BoolToken => ({
  type: "bool",
  value: (number[0].value & 1) === 0,
})

const eq = (list: EvaluatedToken[]): BoolToken => ({
  type: "bool",
  value: list[0].value === list[1].value,
})

const join = (strings: StringToken[]) => ({
  type: "string",
  value: strings.map(s => s.value).join(""),
})

export const builtinEnv = {
  "even?": even,
  sum,
  eq,
  PI: 3.141592653589793,
  join,
  // "load-file":(a:any[])=> readFile(a[0])
}

// Object.getOwnPropertyNames(Math).forEach(propertyName => {
//   builtinEnv[propertyName] = Math[propertyName]
// })

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
