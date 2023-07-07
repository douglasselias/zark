import { createEnv, setValueOnCurrentEnv, getValueOnEnv, globalBindings, findEnv } from "./env"
import { Token} from "./token"
import {  read } from "./reader"


export const evaluate = (exp, env) => {
  if (isSymbol(exp)) return builtinEnv[exp.value]
  if (isNum(exp)) return exp.value

  const proc = evaluate(car(exp), env)
  const args = evalList(cdr(exp), env)
  return proc(args)
}

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b)
export const builtinEnv = { '+': sum, sum }

const isSymbol = (exp) => isAtom(exp) && exp.type === "symbol"
const isNum = (token: Token) => isAtom(token) && token.type === "number"
const isAtom = (token) => !Array.isArray(token)

const evalList = (exps: Token[], env) => exps.map(exp => evaluate(exp, env))
const car = (exp: any) => exp[0]

const cdr = (exp: any) => exp.slice(1)