

export const defaultEnv: Record<string, Function | number> = {
  '+': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  '*': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  '-': (numbers: number[]) => numbers.reduce((a, b) => a - b),
  '/': (numbers: number[]) => numbers.reduce((a, b) => a / b),
  'append': (strings: string[]) => strings.reduce((a, b) => a + b),
  '===': (booleans: boolean[]) => booleans.every(bool => bool === true),
}

export const defaultBindings = {
  'sum': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  'multiply': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  'subtract': (numbers: number[]) => numbers.reduce((a, b) => a - b),
  'divide': (numbers: number[]) => numbers.reduce((a, b) => a / b),
  'append': (strings: string[]) => strings.reduce((a, b) => a + b),
  'is-all-equal?': (booleans: boolean[]) => booleans.every(bool => bool === true),
  // 'define': (name: string, value: any, env: any) => env[name] = value,
}

type Env = {
  outerEnv: Env
  data: Record<any, any>
  setValueOnCurrentEnv: (key, value) => any
  findEnv: (key) => Env | undefined
  getValueOnEnv: (key) => any
}

const createEnv_FP = () => {
  
}

export const createEnv = (outerEnv: Env | null, binds = {}): Env => {
  const data = { ...binds }

  return {
    outerEnv,
    data,
    setValueOnCurrentEnv: (key, value) => setValueOnCurrentEnv(data, key, value),
    findEnv: (key) => findEnv(this, key),
    getValueOnEnv: (key) => getValueOnEnv(this, key),
  }
}

const setValueOnCurrentEnv = (envData, key, value) => {
  envData[key] = value
  return value
}

const findEnv = (env: Env, key) => {
  if (env && key in env.data) return env
  if (env && env.outerEnv) return findEnv(env.outerEnv, key)

  return undefined
}

const getValueOnEnv = (env: Env, key) => {
  const envWithData = findEnv(env, key)
  if (!envWithData) throw new Error(`'${key}' not found`)

  const value = envWithData.data[key]
  if (!value) throw new Error(`'${key}' not found`)

  return value
}

// const dEnv = createEnv(null, defaultEnv)
// const lexEnv = createEnv(dEnv, {
//   'lexical-var': 10,
// })
// lexEnv.data['lexical-var']
