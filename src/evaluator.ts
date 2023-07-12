import { createEnv, findEnv, Env, builtinEnv } from "./env"
import { Expression, Token } from "./token"

const defaultEnv = createEnv(Object.keys(builtinEnv), Object.values(builtinEnv))

export const evaluate = (exp: Expression, env = defaultEnv) => {
  if (isSymbol(exp)) return findEnv(env, (exp as Token).value as string)?.[(exp as Token).value as string]
  if (isNum(exp)) return (exp as Token).value

  const formName = car(exp).value
  if (formName === "define") {
    const [name, subExp] = cdr(exp)
    env[name.value] = evaluate(subExp, env)
    return env[name.value]
  }

  if (formName === "lambda") {
    const [params, body] = cdr(exp)
    const lambda = (lexParams, lexBody, lexEnv) => (lexArgs) => {
      return evaluate(lexBody, createEnv(
        lexParams.map(p => p.value),
        lexArgs.map(a => a),
        lexEnv))
    }
    return lambda(params, body, env)
  }

  if (formName === "if") {
    const [predicate, trueExp, falseExp] = cdr(exp)
    const resultExp = evaluate(predicate, env) ? trueExp : falseExp
    return evaluate(resultExp, env)
  }

  if (formName === "quote") {
    const e = cadr(exp)
    if (Array.isArray(e)) { // TODO: seems like a hack...
      return "(" + e.map((t: Token) => String(t.value)).join(" ") + ")"
    }
    return e.value
  }

  if (formName === "set") {
    const [name, subExp] = cdr(exp)
    const envFound = findEnv(env, name.value as string)
    if (envFound) {
      envFound[name.value as string] = evaluate(subExp, env)
      return envFound[name.value as string]
    }
    else throw new Error("Error (procedure SET): Symbol not found")
  }

  if (formName === "atom?") {
    const [subExp] = cdr(exp)

    if (!Array.isArray(subExp)) {
      if (subExp.type === "symbol") {
        const envFound = findEnv(env, subExp.value as string)
        return envFound ? true : false
      }

      if (subExp.type === "number") return true
    }
    return false
  }

  if (formName === "car") {
    const [subExp] = cdr(exp)
    return car(subExp)
  }

  if (formName === "cdr") {
    const [subExp] = cdr(exp)
    return "(" + (subExp as any).map((t: Token) => String(t.value)).join(" ") + ")" // hack!!!
  }

  if (formName === "list") {
    const [...listParams] = cdr(exp)
    return listParams.map(t => t.value)
  }

  if (formName === "eval") {
    const [subExp] = cdr(exp)
    return evaluate(subExp, env)
  }

  if (formName === "cons") {
    const [a, b] = cdr(exp)
    // return "(" + [a, b].map(t => t.value).join(" . ") + ")" // HACK!!!!
    return [a, b]
  }

  // https://stackoverflow.com/questions/3482389/how-many-primitives-does-it-take-to-build-a-lisp-machine-ten-seven-or-five/3484206#3484206
  // cons/pair – done?
  // cond/if – done

  // let - 
  // letrec -

  const proc = evaluate(car(exp), env)
  const args = evalList(cdr(exp), env)
  return proc(args)
}

const isSymbol = (exp: Expression) => isAtom(exp) && (exp as Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as Token).type === "number"
const isAtom = (exp: Expression) => !Array.isArray(exp)

const evalList = (exps: Expression[], env: Env) => exps.map(exp => evaluate(exp, env))

const car = (exp: Expression): Token => exp[0]
const caar = (exp: any) => exp[0][0]

const cdr = (exp: Expression) => (exp as Token[]).slice(1)
const cadr = (exp: Expression) => car(cdr(exp))
const caddr = (exp: Expression) => car(cdr(cdr(exp)))
const cadddr = (exp: Expression) => car(cdr(cdr(cdr(exp))))


// showError err =
//   case err of
//     (IOError txt)          -> T.concat ["Error reading file: ", txt]
//     (NumArgs int args)     -> T.concat ["Error Number Arguments, expected ", T.pack $ show int, " recieved args: ", unwordsList args]
//     (LengthOfList txt int) -> T.concat ["Error Length of List in ", txt, " length: ", T.pack $ show int]
//     (ExpectedList txt)     -> T.concat ["Error Expected List in funciton ", txt]
//     (TypeMismatch txt val) -> T.concat ["Error Type Mismatch: ", txt, showVal val]
//     (BadSpecialForm txt)   -> T.concat ["Error Bad Special Form: ", txt]
//     (NotFunction val)      -> T.concat ["Error Not a Function: ", showVal val]
//     (UnboundVar txt)       -> T.concat ["Error Unbound Variable: ", txt]
//     (PError str)           -> T.concat ["Parser Error, expression cannot evaluate: ",T.pack str]
//     (Default val)          -> T.concat ["Error, Danger Will Robinson! Evaluation could not proceed!  ", showVal val]