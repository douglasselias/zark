import readline from 'readline'

const lineReader = readline.createInterface({
  input: process.stdin, output: process.stdout
})

export const prompt = (promptText: string, callback: (answer: string) => null) => {
  lineReader.question(promptText, (answer) => {
    log(rep(answer))
    return answer === 'exit' ? null : loop()
  })
}