import { Expression } from "./token"

export const printExpression = (exp: Expression): string => {
  if (Array.isArray(exp))
    return `(${exp.map(d => printExpression(d)).join(" ")})`
  // if (exp.type === "symbol")
  //   return exp.value.toString()
  // if (exp.type === "number")
  //   return exp.value.toString()
  if (typeof exp === "function")
    return `#<${exp}-function>`
  // if (exp.type === "boolean")
  //   return exp ? "true" : "false"
  // if (exp === null)
  //   return "nil" // unreachable code?
  return String(exp.value)
}