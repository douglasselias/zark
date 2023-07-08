import { createEnv, findValue, Env, builtinEnv } from "./env"
import { Expression, Token } from "./token"

const defaultEnv = createEnv(Object.keys(builtinEnv), Object.values(builtinEnv))

export const evaluate = (exp: Expression, env = defaultEnv) => {
  if (isSymbol(exp)) return findValue(env, (exp as Token).value as string)
  if (isNum(exp)) return (exp as Token).value

  const proc = evaluate(car(exp), env)
  const args = evalList(cdr(exp), env)
  return proc(args)
}

const isSymbol = (exp: Expression) => isAtom(exp) && (exp as Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as Token).type === "number"
const isAtom = (exp: Expression) => !Array.isArray(exp)

const evalList = (exps: Expression[], env: Env) => exps.map(exp => evaluate(exp, env))
const car = (exp: Expression) => exp[0]
const cdr = (exp: Expression) => (exp as Token[]).slice(1)