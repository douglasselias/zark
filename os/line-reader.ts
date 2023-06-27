import readline from 'readline'

const lineReader = readline.createInterface({
  input: process.stdin, output: process.stdout
})

export const prompt = (promptText: string, exitCommand: string, callback: (answer: string) => void) => {
  lineReader.question(promptText, (answer) => {
    callback(answer)
    return answer === exitCommand ? null : prompt(promptText, exitCommand, callback)
  })
}