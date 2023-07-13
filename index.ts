import { prompt } from "./os/stdin-reader"

import { read } from "./src/reader"
import { evaluate } from "./src/evaluator"
import { print } from "./src/printer"

const { log, clear } = console

const REP = (text: string) => {
  if (text.trim().length === 0) return
  try { print(evaluate(read(text))) }
  catch (e) { log(e.message) }
}

clear()
log("Zark Lisp - Version 0.0.0-alpha")
log("Commands:")
log("exit -> Exit the REPL")
prompt("> ", REP)
