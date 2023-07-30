import { Expression, AST_Token } from "./token"
import { createEnv, Env, builtinEnv } from "./env"

const compiledExpressions: string[] = []

// const compileFn = (name, args, body) => {

// }

const defaultEnv = createEnv(Object.keys(builtinEnv), Object.values(builtinEnv))
const generateHeaders = () => {
  compiledExpressions.push("// HEADERS - DEFAULT ENV")
  for (const entry of Object.entries(defaultEnv)) {
    const [key, value] = entry
    // console.log(entry)
    if(key === "outer") continue // maybe recursive? but initial outer is null
compiledExpressions.push(`const ${value.name} = ${value.toString()}`)
  }

  compiledExpressions.push("// END HEADERS - DEFAULT ENV")

}
generateHeaders()
// console.log(compiledExpressions.join("\n"))

export const compile = (exp: Expression) => {
  if (isSymbol(exp)) return (exp as AST_Token).value
  if (isNum(exp)) return (exp as AST_Token).value.toString()

  const formName = car(exp).value
  if (formName === "define") {
    const [name, subExp] = cdr(exp)
    compiledExpressions.push(`const ${name.value} = ${subExp.value}`)
    
    // env[name.value] = evaluate(subExp, env)
    // return env[name.value]
  }

  return compiledExpressions.join("\n")
}
 
const isSymbol = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "symbol"
const isNum = (exp: Expression) => isAtom(exp) && (exp as AST_Token).type === "number"
const isAtom = (exp: Expression) => !Array.isArray(exp)

const car = (exp: Expression): AST_Token => exp[0]
const caar = (exp: any) => exp[0][0]

const cdr = (exp: Expression) => (exp as AST_Token[]).slice(1)
const cadr = (exp: Expression) => car(cdr(exp))
const caddr = (exp: Expression) => car(cdr(cdr(exp)))
const cadddr = (exp: Expression) => car(cdr(cdr(cdr(exp))))