import { prompt } from "./os/stdin-reader"

import { read as READ } from './compiler/reader'

import { evaluate } from './compiler/evaluator'
import { createEnv, globalBindings } from './compiler/env'

import { printExpression } from './compiler/printer'

const { log, clear } = console

const globalEnv = createEnv(globalBindings)

const EVAL = (tokens: any) => evaluate(tokens, globalEnv)
const PRINT = (token: string) => log(printExpression(token))

const REP = (text: string) => {
  if (text.trim().length === 0) return
  try { PRINT(EVAL(READ(text))) }
  catch (e) { log(e) }
}

clear()
log("Zark Lisp - Version 0.0.0-alpha")
log("Commands:")
log("exit -> Exit the REPL")
prompt("> ", REP)

//////////////////qq

export type Lens<O, V> = {
  get: (obj: O) => V
  set: (obj: O) => (newValue: V) => O
}

// specific for objects
function lensProp<O, V>(key: string): Lens<O, V> {
  return {
    get: (obj: O): V => obj[key],
    set: (obj: O) => (value: V): O => ({ ...obj, [key]: value }),
  }
}

function view<O, V>(lens: Lens<O, V>, obj: O): V {
  return lens.get(obj)
}

function set<O, V>(lens: Lens<O, V>, obj: O, value: V): O {
  return lens.set(obj)(value)
}

function over<T, A, B>(lens: Lens<T, A>, f: (x: A) => A, obj: T) {
  return lens.set(obj)(f(lens.get(obj)))
}
interface User {
  name: string;
  email: string;
  address: {
    country: string;
  };
}

const nameLens: Lens<User, string> = lensProp("name");

const user: User = {
  name: "Theo",
  email: "theo@example.com",
  address: {
    country: "Ireland",
  },
};

const prefixedName: User = over(
  nameLens,
  (name: string) => `Mr. ${name}`,
  user,
)

console.log(view(nameLens, prefixedName)) // Mr. Theo