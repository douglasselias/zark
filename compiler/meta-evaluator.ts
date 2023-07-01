const eval_ = (exp: any, env) => {
  if (atom(exp)) return lookup(exp, env)
  if (atom(car(exp))) {
    if (eq(car(exp), Q('quote'))) return cadr(exp)
    if (eq(car(exp), Q('if'))) return eval_(cadr(exp), env)
      ? eval_(caddr(exp), env)
      : eval_(cadddr(exp), env)
  }
}

const lookup = (symbol, env) => { }

// JS
const Q = (s: string) => Symbol(s)

// buil-in
const atom = (exp: any) => typeof exp === 'symbol'
const eq = (exp: any, symbol: Symbol) =>
  exp.toString() === symbol.toString()

const car = (exp: any) => exp[0]
const cdr = (exp: any) => exp.slice(1)
const cadr = (exp: any) => car(cdr(exp))
const caddr = (exp: any) => car(cdr(cdr(exp)))
const cadddr = (exp: any) => car(cdr(cdr(cdr(exp))))
