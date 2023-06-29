export const printExpression = (exp: unknown): string => {
  if (typeof exp === 'symbol')
    return exp.toString()
  if (typeof exp === 'number')
    return exp.toString()
  if (typeof exp === 'boolean')
    return exp ? 't' : 'nil'
  if (exp === null)
    return 'nil' // unreachable code?
  if (Array.isArray(exp))
    return `(${exp.map(d => printExpression(d)).join(' ')})`
  return String(exp)
}