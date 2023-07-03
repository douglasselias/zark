import { createInterface } from "readline"

const { stdin, stdout } = process
const readLineInterface = createInterface({ input: stdin, output: stdout, })

export const prompt: Prompt = (promptPrefix, callback) => {
  readLineInterface.question(promptPrefix, (answer) => {
    callback(answer)
    return answer === "exit" ? process.exit() : prompt(promptPrefix, callback)
  })
}

type Prompt = (promptPrefix: string, callback: Callback) => void
type Callback = (answer: string) => void