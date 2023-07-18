import { createEnv, findEnv, Env, builtinEnv } from "./env"
import { Expression, AST_Token, EvaluatedToken } from "./token"

const defaultEnv = createEnv(Object.keys(builtinEnv), Object.values(builtinEnv))

export const evaluate = (exp: Expression, env = defaultEnv) => {
  if (isSymbol(exp)) {
    const result = findEnv(env, (exp as AST_Token).value as string)?.[(exp as AST_Token).value as string]
    if (typeof result === "function") return { type: "procedure", value: result }
    if (typeof result === "number") return { type: "number", value: result }
    return result
  }
  if (isNum(exp)) return (exp as EvaluatedToken)

  const formName = car(exp).value
  const formBody = cdr(exp)

  if (formName === "define") {
    const [name, subExp] = formBody
    // if (name.type !== "symbol") throw new Error("define only accept symbols as first argument")
    env[name.value as string] = evaluate(subExp, env)
    return env[name.value as string]
  }

  if (formName === "lambda") {
    const [params, body] = formBody
    const lambda = (lexArgs) => {
      return evaluate(
        body,
        createEnv((params as any).map(p => p.value), lexArgs, env)
      )
    }
    return { type: "procedure", value: lambda }
  }

  if (formName === "if") {
    const [predicate, trueExp, falseExp] = formBody
    const resultExp = evaluate(predicate, env).value ? trueExp : falseExp
    return evaluate(resultExp, env)
  }

  if (formName === "quote") {
    const [subExp] = formBody
    return subExp
  }

  if (formName === "eval") {
    const [subExp] = formBody
    return evaluate(evaluate(subExp, env),env)
  }

  if (formName === "set") {
    const [name, subExp] = formBody
    const envFound = findEnv(env, name.value as string)
    if (envFound) {
      envFound[name.value as string] = evaluate(subExp, env)
      return envFound[name.value as string]
    }
    else throw new Error("Error (procedure SET): Symbol not found")
  }

  if (formName === "atom?") {
    const [subExp, execeedArguments] = formBody
    if (execeedArguments) throw new Error("invalid proc call: too many arguments")

    const r = evaluate(subExp, env)

    if (Array.isArray(r)) return { type: "bool", value: false }
    if(!r) return { type: "bool", value: false}
    if (r.type === "number") return { type: "bool", value: true }

    if (r.type === "symbol") {
      const envFound = findEnv(env, r.value as string)
      return envFound ? { type: "bool", value: true } : { type: "bool", value: false }
    }

    return { type: "bool", value: false }
  }

  if (formName === "car") {
    const [subExp, execeedArguments] = formBody
    // if (execeedArguments) throw new Error("invalid proc call: too many arguments")
    // if (!subExp) throw new Error("invalid proc call: not enough arguments. CAR expects a single list as argument")
    if (execeedArguments || !subExp) throw new Error("CAR expects a single list as argument")
    return car(evaluate(subExp, env))
  }

  if (formName === "cdr") {
    const [subExp, execeedArguments] = formBody
    if (execeedArguments) throw new Error("invalid proc call: too many arguments")
    return cdr(evaluate(subExp, env))
  }

  if (formName === "list") {
    return formBody.map(e => evaluate(e, env))
  }

  if (formName === "cons" || formName === "pair") {
    const [a, b] = formBody
    return [evaluate(a, env), evaluate(b, env)]
  }

  if (formName === "cond" || formName === "match") {
    throw new Error(formName + " procedure not implemented")
  }

  const proc = evaluate(car(exp), env)
  const args = evalList(cdr(exp), env)
  return proc.value(args)
}

const isSymbol = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "number"
const isAtom = (exp: Expression) => !Array.isArray(exp)

const evalList = (exps: Expression[], env: Env) => exps.map(exp => evaluate(exp, env))

const car = (exp: Expression): AST_Token => exp[0]
// const caar = (exp: any) => exp[0][0]

const cdr = (exp: Expression) => (exp as AST_Token[]).slice(1)
// const cadr = (exp: Expression) => car(cdr(exp))
// const caddr = (exp: Expression) => car(cdr(cdr(exp)))
// const cadddr = (exp: Expression) => car(cdr(cdr(cdr(exp))))


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