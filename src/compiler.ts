import { Expression, AST_Token } from "./token"
import { findEnv, builtinEnvForCompilation, createEnv, Env } from "./env"

const compiledExpressions: string[] = []
const defaultEnv = createEnv(Object.keys(builtinEnvForCompilation), Object.values(builtinEnvForCompilation))

export const compile = (exp: Expression, env = defaultEnv) => {
  if (isSymbol(exp)) {
    const result = findEnv(env, (exp as AST_Token).value as string)?.[(exp as AST_Token).value as string]
    if (typeof result === "function") return { type: "procedure", value: result }
    return result
  }
  if (isNum(exp)) {
    const num = String((exp as AST_Token).value)
    // compiledExpressions.push(num)
    return num
  }
  if (isFloat(exp)) return (exp as AST_Token)
  if (isString(exp)) return (exp as AST_Token)

  const formName = car(exp).value
  const formBody = cdr(exp)

  if (formName === "define") {
    const [name, subExp] = formBody
    let n = isList(name) ? compile(name, env) : name
    env[n.value as string] = compile(subExp, env)
    return env[n.value as string]
  }

  if (formName === "lambda") {
    const [params, body] = formBody
    const lambda = (lexArgs) => {
      return compile(
        body,
        createEnv((params as any).map(p => p.value), lexArgs, env)
      )
    }
    return { type: "procedure", value: lambda }
  }

  if (formName === "if") {
    const [predicate, trueExp, falseExp] = formBody
    const resultExp = compile(predicate, env).value ? trueExp : falseExp
    return compile(resultExp, env)
  }

  if (formName === "q") { // quote
    const [subExp] = formBody
    return subExp
  }

  if (formName === "qq") { // quasiquote
    const [subExp, execeedArguments] = formBody
    if (execeedArguments) throw new Error("invalid proc call (qq): too many arguments")

    const expand_quasiquote = (qq_ast: AST_Token[]) => {
      const expandedForm: any = []

      let index = 0
      while (index < qq_ast.length) {
        const ast_token = qq_ast[index]
        if (ast_token.type === "symbol" && ast_token.value === "uq") {
          expandedForm.push(compile(qq_ast[index + 1], env))
          index += 2
          continue
        }
        if (isList(ast_token)) {
          expandedForm.push(expand_quasiquote(ast_token as any))
          index++
          continue
        }
        expandedForm.push(ast_token)
        index++
      }

      return expandedForm
    }

    return expand_quasiquote(subExp as any)
  }

  if (formName === "uq") { // unquote
    const [subExp] = formBody
    return compile(subExp, env)
  }

  if (formName === "suq") { // splice-unquote
    const [subExp] = formBody
    return subExp
  }

  if (formName === "do") {
    return formBody.map(form => {
      return compile(form, env)
    }).join("\n")
  }

  if (formName === "eval") {
    const [subExp] = formBody
    return compile(compile(subExp, env), env)
  }

  if (formName === "set") {
    const [name, subExp] = formBody
    const envFound = findEnv(env, name.value as string)
    if (envFound) {
      envFound[name.value as string] = compile(subExp, env)
      return envFound[name.value as string]
    }
    else throw new Error("Error (procedure SET): Symbol not found")
  }

  if (formName === "atom?") {
    const [subExp, execeedArguments] = formBody
    if (execeedArguments) throw new Error("invalid proc call: too many arguments")

    const r = compile(subExp, env)

    if (isList(r)) return { type: "bool", value: false }
    if (!r) return { type: "bool", value: false }
    if (r.type === "number") return { type: "bool", value: true }
    if (r.type === "float") return { type: "bool", value: true }

    if (r.type === "symbol") {
      const envFound = findEnv(env, r.value as string)
      return envFound ? { type: "bool", value: true } : { type: "bool", value: false }
    }

    return { type: "bool", value: false }
  }

  if (formName === "car") {
    const [subExp, execeedArguments] = formBody
    if (execeedArguments || !subExp) throw new Error("CAR expects a single list as argument")
    return car(compile(subExp, env))
  }

  if (formName === "cdr") {
    const [subExp, execeedArguments] = formBody
    if (execeedArguments) throw new Error("CDR expects a single list as argument")
    return cdr(compile(subExp, env))
  }

  if (formName === "list") {
    return formBody.map(e => compile(e, env))
  }

  if (formName === "cons" || formName === "pair") {
    const [a, b] = formBody
    return [compile(a, env), compile(b, env)]
  }

  if (formName === "cond" || formName === "match") {
    throw new Error(formName + " procedure not implemented")
  }

  if (formName === "while") {
    const [condition, body] = formBody
    let lastEvaluation
    while (compile(condition, env).value) {
      lastEvaluation = compile(body, env)
    }
    return lastEvaluation
  }

  const proc = compile(car(exp), env)
  const args = evalList(cdr(exp), env)
  // return proc.value(args)
  return compiledExpressions.join("\n")
}

const isSymbol = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "number"
const isFloat = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "float"
const isString = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "string"
const isAtom = (exp: Expression) => !isList(exp)
const isList = (exp: Expression) => Array.isArray(exp)

const evalList = (exps: Expression[], env: Env) => exps.map(exp => compile(exp, env))

const car = (exp: Expression): AST_Token => exp[0]
const cdr = (exp: Expression) => (exp as AST_Token[]).slice(1)
