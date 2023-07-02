const eval_ = (exp: any, env) => {
  console.log('EXP: ', exp)
  if (isNum(exp)) return exp
  if (atom(exp)) return lookup(exp, env)
  if (atom(car(exp))) {
    if (eq(car(exp), A('quote'))) return cadr(exp)
    if (eq(car(exp), A('if'))) return eval_(cadr(exp), env)
      ? eval_(caddr(exp), env)
      : eval_(cadddr(exp), env)
    if (eq(car(exp), A('lambda')))
      return makeFunction(cadr(exp), caddr(exp), env)
    return apply(car(exp), evlis(cdr(exp), env), env)
  }
  return apply(eval_(car(exp), env), evlis(cdr(exp), env), env)
}

const apply = (fn, args, env) => {
  const _fn = symbolToString(fn)
  console.log('FN: ', _fn)
  if (builtin(_fn)) return applyBuiltin(_fn, args)
  if (function_(_fn)) return eval_(caddr(_fn), extend(args, cadddr(_fn), env))
  return console.error(`Função inválida ${_fn}`)
}

// LISP
const makeFunction = (args, body, env) =>
  [A('function'), args, body, env]
const evlis = (exps: any[], env) => exps.map(exp => eval_(exp, env))
const lookup = (symbol, env) => {
  if (!env) return console.error(`Variável não definida ${symbol}`)
  return (eq(caar(env), symbol)) ? cadr(env)
    : lookup(symbol, cdr(env))
}
const extend = (vars: any[], vals: any[], env) => {
  const zipped = vars.map((varName, index) => [varName, vals[index]])
  return [zipped, ...env]
}

// JS
const A = (s: string) => Symbol(s)
const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b)
const multiply = (numbers: number[]) => numbers.reduce((a, b) => a * b)
const isNum = (exp) => typeof exp === 'number'
const symbolToString = (symbol: Symbol): string => symbol.toString().replace('Symbol(', '').replace(')', '')

// Lisp again...
const builtinEnv = { '+': sum, sum, multiply }
const builtin = (symbol) => builtinEnv[symbol] !== undefined
const applyBuiltin = (fn, args) => {

  return builtinEnv[fn](args)
}

// buil-in Lisp
const atom = (exp: any) => typeof exp === 'symbol'
const function_ = (exp: any) => typeof exp === 'function'
const eq = (exp: any, symbol: Symbol) =>
  exp.toString() === symbol.toString()

const car = (exp: any) => exp[0]
const caar = (exp: any) => exp[0][0]

const cdr = (exp: any) => exp.slice(1)
const cadr = (exp: any) => car(cdr(exp))
const caddr = (exp: any) => car(cdr(cdr(exp)))
const cadddr = (exp: any) => car(cdr(cdr(cdr(exp))))

const globalEnv__ = []

// console.log(eval_([A('+'), 10, [A('multiply'), 10, 20]], globalEnv__))

console.log(eval_([A('if'), 0, 10, 20], globalEnv__))
