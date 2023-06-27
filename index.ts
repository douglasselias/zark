import { prompt } from './os/line-reader'

import { tokenize } from './compiler/tokenizer'
import { readTokens } from './compiler/token-reader'

import { evaluate } from './compiler/evaluator'

import { printExpression } from './compiler/printer'

const { log, clear } = console

const READ = (text: string) => readTokens(tokenize(text))
const EVAL = (tokens: any) => evaluate(tokens)
const PRINT = (token: string) => log(printExpression(token))

const REP = (text: string) => {
  try { PRINT(EVAL(READ(text))) }
  catch (e) { log(e) }
}

clear()
log('Zark Lisp - Version 0.0.0-alpha')
prompt('> ', '(exit)', REP) // change to regex; (  exit  ) will not work
