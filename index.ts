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
log('Zark Lisp - Version 0.0.0-alpha')
prompt('> ', REP)
