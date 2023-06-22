export const tokenize = (source: string): string[] =>
  source
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .split(/\s+/g)
    .filter(char => !(/\s+/g.test(char) || char === ''))