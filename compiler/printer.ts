export const printExpression = (exp: unknown): string => {
  if (typeof exp === 'symbol')
    return exp.toString()
  if (typeof exp === 'number')
    return exp.toString()
  if (Array.isArray(exp))
    return `(${exp.map(d => printExpression(d)).join(' ')})`
  return String(exp)
}