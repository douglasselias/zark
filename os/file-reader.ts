import fs from 'fs'

// export const { log } = console

export const readFile = (path: string) => fs.readFileSync(path).toString()
