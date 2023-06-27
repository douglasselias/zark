export const pr_str = (data) => {
  if (typeof data === 'symbol')
    return data.toString()
  if (typeof data === 'number')
    return data.toString()
  if (typeof data === 'object' && (data as Array<any>).length)
    return `(${data.map(d => pr_str(d)).join(', ')})`
}