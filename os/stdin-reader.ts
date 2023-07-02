import { createInterface } from "readline"

const { stdin, stdout } = process

const { question } = createInterface({ input: stdin, output: stdout, })

export const prompt: Prompt = (input, exitCommand, callback) => {
  question(input, (answer) => {
    callback(answer)
    return exitCommand.test(answer) ? null : prompt(input, exitCommand, callback)
    // TODO: may cause stack overflow, since it's using recursion
  })
}

type Prompt = (promptText: string, exitCommand: RegExp, callback: PromptCallback) => void
type PromptCallback = (answer: string) => void