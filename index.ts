import { prompt } from "./os/stdin-reader"

import { read } from "./compiler/reader"
import { evaluate } from "./compiler/evaluator"
import { print } from "./compiler/printer"

const { log, clear } = console

const REP = (text: string) => {
  if (text.trim().length === 0) return
  try { print(evaluate(read(text))) }
  catch (e) { log(e) }
}

clear()
log("Zark Lisp - Version 0.0.0-alpha")
log("Commands:")
log("exit -> Exit the REPL")
prompt("> ", REP)
