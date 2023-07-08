// import { createEnv, setValueOnCurrentEnv, getValueOnEnv, globalBindings, findEnv } from "./env"
import { Expression, Token} from "./token"

export const evaluate = (exp: Expression, env) => {
  if (isSymbol(exp)) return builtinEnv[(exp as Token).value]
  if (isNum(exp)) return (exp as Token).value

  const proc = evaluate(car(exp), env)
  const args = evalList(cdr(exp), env)
  return proc(args)
}

const isSymbol = (exp: Expression) => isAtom(exp) && (exp as Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as Token).type === "number"
const isAtom = (exp: Expression) => !Array.isArray(exp)

const evalList = (exps: Token[], env) => exps.map(exp => evaluate(exp, env))
const car = (exp: any) => exp[0]
const cdr = (exp: any) => exp.slice(1)