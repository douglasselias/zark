import readline from 'readline'
const lineReader = readline.createInterface({ input: process.stdin, output: process.stdout })
const { log } = console

import { readString } from './mal/reader'
import { pr_str } from './mal/printer'

const READ = (a: string) => { return readString(a) }
const EVAL = (a: any) => { return a }
const PRINT = (a: string) => { return pr_str(a) }

const rep = (a: string) => { return PRINT(EVAL(READ(a))) }

export const loop = () => {
  lineReader.question('zark * ', (answer) => {
    log(rep(answer))
    return answer === 'exit' ? null : loop()
  })
}

loop()