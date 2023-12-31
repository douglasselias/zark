import { readFile } from "../os/file-reader"
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

const loadFile = (path: StringToken[]) => read(readFile(path[0].value))

const toString = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const firstArg = args[0]
  if (Array.isArray(firstArg))
    return { type: "string", value: `(${firstArg.map(token => String(token.value)).join(" ")})` }
  return { type: "string", value: String(firstArg.value) }
}

const toNumber = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const firstArg = args[0] as EvaluatedToken
  if (Array.isArray(firstArg))
    throw new Error("to-number expects a single argument, not a list")
  return { type: "number", value: Number(firstArg.value) }
}

const head = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const list = args[0] as EvaluatedToken[]
  if (!Array.isArray(list))
    throw new Error("head expects a single list as argument")
  return list[0]
}

const tail = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const list = args[0] as EvaluatedToken[]
  if (!Array.isArray(list))
    throw new Error("tail expects a single list as argument")
  return list.slice(1)
}

const map = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const [fn, list] = args as any
  return (list as EvaluatedToken[]).map(token => {
    // must return as array since every fn in env expects an array
    return fn.value([token])
  })
}

const size = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const [list] = args as any
  if (Array.isArray(list))
    return { type: "number", value: (list as EvaluatedToken[]).length }
  throw new Error("size only accepts a single list as a paramenter")
}

const isList = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const [list] = args as any
  return { type: "bool", value: Array.isArray(list) }
}

const isString = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const [token] = args as any
  return { type: "bool", value: token.type === "string" }
}

const isNumber = (args: (EvaluatedToken | EvaluatedToken[])[]) => {
  const [token] = args as any
  return { type: "bool", value: token.type === "number" || token.type === "float" }
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
  print: (v) => console.log(v),
  "to-string": toString,
  "to-number": toNumber,
  head, tail,
  map, size, "is-list": isList,
  "is-string": isString, "is-number": isNumber,
}

export const builtinEnvForCompilation = {
  "even?": even,
  sum: (n) => n.reduce((acc, curr) => acc + curr, 0),
  sub, div, mul,
  "less-than": lessThan,
  "greater-than": greaterThan,
  eq,
  PI: Math.PI,
  join: (c) => c.join(""),
  "load-file": loadFile,
  print: (v) => console.log(v),
  "to-string": toString,
  "to-number": toNumber,
  head, tail,
  map, size, "is-list": isList,
  "is-string": isString, "is-number": isNumber,
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
