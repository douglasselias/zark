import { Expression } from "./token"

export const expressionToString = (exp: Expression): string => {
  if (Array.isArray(exp))
    return `(${exp.map(e => expressionToString(e)).join(" ")})`
  if (exp.type === "procedure")
    return `#<procedure(${exp.value.name})>`
  return String(exp.value)
}