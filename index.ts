import { prompt } from "./os/stdin-reader"
import { log, clear } from "./os/console"

import { read } from "./src/reader"
import { evaluate } from "./src/evaluator"
import { expressionToString } from "./src/printer"

const print = (token) => log(expressionToString(token))

const readEvalPrint = (text: string) => {
  if (text.trim().length === 0) return
  try { print(evaluate(read(text))) }
  catch (e) { log(e.message) }
}

clear()
log("Zark Lisp - Version 0.0.0-alpha")
log("Commands:")
log("exit -> Exit the REPL")
prompt("> ", readEvalPrint)
