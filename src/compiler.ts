import { Expression, AST_Token } from "./token"
import { createEnv, builtinEnv, findEnv } from "./env"
import { evaluate } from "./evaluator"

const compiledExpressions: string[] = []

// const compileFn = (name, args, body) => {

// }
const defaultEnv = createEnv(Object.keys(builtinEnv), Object.values(builtinEnv))
const generateHeaders = () => {
  compiledExpressions.push("// HEADERS - DEFAULT ENV")
  for (const entry of Object.entries(defaultEnv)) {
    const [key, value] = entry
    // console.log(entry)
    if (key === "outer") continue // maybe recursive? but initial outer is null
    compiledExpressions.push(`const ${value.name} = ${value.toString()}`)
  }

  compiledExpressions.push("// END HEADERS - DEFAULT ENV")

}
// generateHeaders()
// console.log(compiledExpressions.join("\n"))
const compileEnv = {sum: (a, b) => a + b, outer: null}

export const compile = (exp: Expression, env = defaultEnv) => {
  // console.log('EXP: ', exp)
  if (isSymbol(exp)) {
    const found = findEnv(compileEnv, (exp as any).value)?.[(exp as any).value]
    if (typeof found === "function") {

      compiledExpressions.unshift(`const ${found.name} = ${found.toString()}`)
      return found
    }
    
    return (exp as AST_Token).value
  }
  if (isNum(exp)) {
    return String((exp as AST_Token).value)
  }

  const formName = car(exp).value
  const formBody = cdr(exp)

  if (formName === "define") {
    const [name, subExp] = formBody
    let v = subExp.value
    if (Array.isArray(subExp)) v = compile(subExp, env)
    compiledExpressions.push(`const ${name.value} = ${v}`)
  }

  if (formName === "do") {
    return formBody.map(form => {
      return compile(form, env)
    })[formBody.length - 1]
  }

  const proc = compile(car(exp), env)
  const args = evalList(cdr(exp), env)
  compiledExpressions.push(`${proc.name}(${args.map(a=>String(a)).join(",")})`)
  // return proc.value(args)

  return compiledExpressions.join("\n")
}

const evalList = (exps: Expression[], env: any) => exps.map(exp => compile(exp, env))

const isSymbol = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "number"
const isAtom = (exp: Expression) => !Array.isArray(exp)

const car = (exp: Expression): AST_Token => exp[0]
const caar = (exp: any) => exp[0][0]

const cdr = (exp: Expression) => (exp as AST_Token[]).slice(1)
const cadr = (exp: Expression) => car(cdr(exp))
const caddr = (exp: Expression) => car(cdr(cdr(exp)))
const cadddr = (exp: Expression) => car(cdr(cdr(cdr(exp))))