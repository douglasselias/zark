import { readFile } from "../os/file-reader"
import { evaluate } from "./evaluator"
import { read } from "./reader"

import { NumberToken, EvaluatedToken, BoolToken, StringToken, FloatToken } from "./token"

const sum = (numbers: (NumberToken | FloatToken)[]): NumberToken | FloatToken => ({
  type: numbers.some(n => n.type === "float") ? "float" : "number",
  value: numbers.reduce((total, current) => current.value + total, 0),
})

const mul = (numbers: (NumberToken | FloatToken)[]): NumberToken | FloatToken => ({
  type: numbers.some(n => n.type === "float") ? "float" : "number",
  value: numbers.reduce((total, current) => current.value * total, 1),
})

const sub = (numbers: (NumberToken | FloatToken)[]): NumberToken | FloatToken => ({
  type: numbers.some(n => n.type === "float") ? "float" : "number",
  value: numbers.slice(1).reduce((total, current) => total - current.value, numbers[0].value),
})

const div = (numbers: (NumberToken | FloatToken)[]): NumberToken | FloatToken => ({
  type: numbers.some(n => n.type === "float") ? "float" : "number",
  value: numbers.slice(1).reduce((total, current) => total / current.value, numbers[0].value),
})

const even = (number: NumberToken[]): BoolToken => ({
  type: "bool",
  value: (number[0].value & 1) === 0,
})

const eq = (list: EvaluatedToken[]): BoolToken => ({
  type: "bool",
  value: list[0].value === list[1].value,
})

const lessThan = (numbers: (NumberToken | FloatToken)[]) => ({
  type: "bool",
  value: numbers[0].value < numbers[1].value,
})

const greaterThan = (numbers: (NumberToken | FloatToken)[]) => ({
  type: "bool",
  value: numbers[0].value > numbers[1].value,
})

const join = (strings: StringToken[]) => ({
  type: "string",
  value: strings.map(s => s.value).join(""),
})

const loadFile = (path: StringToken[]) => ({
  type: "string", // eval should not be here...
  value: evaluate(read(readFile(path[0].value))),
})

const evalFn = (exps: any[]) => {
  // TODO, test...
  return evaluate(exps)
}

export const builtinEnv = {
  "even?": even,
  sum, sub, div, mul,
  "less-than": lessThan,
  "greater-than": greaterThan,
  eq,
  PI: { type: "float", value: Math.PI },
  join,
  "load-file": loadFile,
  "eval": evalFn
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
