export const print = (value: unknown) => console.log(printExpression(value))

export const printExpression = (value: unknown): string => {
  if (Array.isArray(value))
    return `(${value.map(d => printExpression(d)).join(" ")})`
  if (typeof value === "function")
    return `#<procedure(${value.name})>`
  return String(value)
}