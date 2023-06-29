export const globalBindings: Env['bindings'] = {
  'sum': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  'multiply': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  'subtract': (numbers: number[]) => numbers.reduce((a, b) => a - b),
  'divide': (numbers: number[]) => numbers.reduce((a, b) => a / b),
  'append': (strings: string[]) => strings.reduce((a, b) => a + b),
  'is-all-equal?': (booleans: boolean[]) => booleans.every(bool => bool === true),
  'even?': (value: number) => (value & 1) === 0,
  // 'define': (name: string, value: any, env: any) => env[name] = value,
  '+': (numbers: number[]) => numbers.reduce((a, b) => a + b),
  '*': (numbers: number[]) => numbers.reduce((a, b) => a * b),
  '-': (numbers: number[]) => numbers.reduce((a, b) => a - b),
  '/': (numbers: number[]) => numbers.reduce((a, b) => a / b),
  '===': (booleans: boolean[]) => booleans.every(bool => bool === true),
}

type Env = {
  bindings: Record<string, any>
  outerEnv: Env | null
}

// should binds have a default value?
type CreateEnv = (binds: Env['bindings'], outerEnv?: Env) => Env
export const createEnv: CreateEnv = (binds = {}, outerEnv = null) => {
  return {
    bindings: { ...binds },
    outerEnv,
  }
}

type SetValueOnCurrentEnv = (env: Env, key: string, value: any) => any
export const setValueOnCurrentEnv: SetValueOnCurrentEnv = (env, key, value) => {
  env.bindings[key] = value
  return value
}

type FindEnv = (env: Env, key: string) => Env | null
export const findEnv: FindEnv = (env, key) => {
  if (env && key in env.bindings) return env
  if (env && env.outerEnv) return findEnv(env.outerEnv, key)

  return null
}

type GetValueOnEnv = (env: Env, key: string) => any
export const getValueOnEnv: GetValueOnEnv = (env: Env, key) => {
  const envWithData = findEnv(env, key)
  if (!envWithData) throw new Error(`'${key}' not found`)

  const value = envWithData.bindings[key]
  if (!value) throw new Error(`'${key}' not found`)

  return value
}
