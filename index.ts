import readline from 'readline'
const lineReader = readline.createInterface({ input: process.stdin, output: process.stdout })
const { log } = console

const READ = (a: string) => { return a }
const EVAL = (a: string) => { return a }
const PRINT = (a: string) => { return a }

const rep = (a: string) => { return PRINT(EVAL(READ(a))) }

const loop = () => {
  lineReader.question('user> ', (answer) => {
    log(rep(answer))
    return answer === 'exit' ? null : loop()
  })
}

loop()