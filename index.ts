import fs from 'fs'
import readline from 'readline'
// import { readTokens } from './compiler/token-reader'
// import { tokenize } from './compiler/tokenizer'

const { log } = console

const reader = readline.createInterface({ input: process.stdin, output: process.stdout, })

// const file = fs.readFileSync('main.zark').toString()

// export const parse = (source: string) => readTokens(tokenize(source))

const repl = () => {
  reader.question('(Zark) * ', input => {
    log(evalScheem(parse(input)))
    return input === 'exit' ? reader.close() : repl()
  })
}

repl()

// process.exit(0)


/////////////////////////////////////

// import * as math from 'mathjs';

type _Symbol = string;
type List = any[];
type _Number = number;

function parse(program: string): any {
  return readFromTokens(tokenize(program));
}

function tokenize(s: string): string[] {
  return s.replace('(', ' ( ').replace(')', ' ) ').split(' ');
}

function readFromTokens(tokens: string[]): any {
  if (tokens.length === 0) {
    throw new SyntaxError('unexpected EOF while reading');
  }
  const token = tokens.shift();
  if (token === '(') {
    const L = [];
    while (tokens[0] !== ')') {
      L.push(readFromTokens(tokens));
    }
    tokens.shift(); // pop off ')'
    return L;
  } else if (token === ')') {
    throw new SyntaxError('unexpected )');
  } else {
    return atom(token);
  }
}

function atom(token: string): number | _Symbol {
  const parsedInt = parseInt(token);
  if (!isNaN(parsedInt)) {
    return parsedInt;
  }
  const parsedFloat = parseFloat(token);
  if (!isNaN(parsedFloat)) {
    return parsedFloat;
  }
  return token as _Symbol;
}

function standardEnv(): Env {
  const env = new Env();
  // env.update(math);
  env.update({
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b,
    '>': (a: number, b: number) => a > b,
    '<': (a: number, b: number) => a < b,
    '>=': (a: number, b: number) => a >= b,
    '<=': (a: number, b: number) => a <= b,
    '=': (a: number, b: number) => a === b,
    'abs': Math.abs,
    'append': (a: any[], b: any[]) => a.concat(b),
    'apply': (...args: any[]) => args[args.length - 1](...args.slice(0, args.length - 1)),
    'begin': (...x: any[]) => x[x.length - 1],
    'car': (x: any[]) => x[0],
    'cdr': (x: any[]) => x.slice(1),
    'cons': (x: any, y: any[]) => [x].concat(y),
    'eq?': (a: any, b: any) => a === b,
    'equal?': (a: any, b: any) => a == b, // tslint:disable-line
    'length': (x: any[]) => x.length,
    'list': (...x: any[]) => Array.from(x),
    'list?': (x: any) => Array.isArray(x),
    'map': (...args: any[]) => args[args.length - 1].map(...args.slice(0, args.length - 1)),
    'max': Math.max,
    'min': Math.min,
    'not': (x: any) => !x,
    'null?': (x: any) => x.length === 0,
    'number?': (x: any) => typeof x === 'number',
    'procedure?': (x: any) => typeof x === 'function',
    'round': Math.round,
    'symbol?': (x: any) => typeof x === 'string',
  });
  return env;
}

class Env {
  outer: Env | null;
  data: { [key: string]: any };

  constructor(outer?: Env) {
    this.outer = outer || null;
    this.data = {};
  }

  update(obj: { [key: string]: any }) {
    Object.assign(this.data, obj);
  }

  find(varName: string): Env {
    if (varName in this.data) {
      return this;
    }
    if (this.outer !== null) {
      return this.outer.find(varName);
    }
    throw new Error(`Symbol ${varName} not found`);
  }
}

const globalEnv = standardEnv();

function evalScheem(x: any, env: Env = globalEnv): any {
  if (typeof x === 'string') {
    return env.find(x).data[x];
  } else if (!Array.isArray(x)) {
    return x;
  } else {
    const [fn, ...args] = x;
    if (fn === 'quote') {
      return args[0];
    } else if (fn === 'if') {
      const [test, conseq, alt] = args;
      return evalScheem(evalScheem(test, env) ? conseq : alt, env);
    } else if (fn === 'set!') {
      const [varName, exp] = args;
      env.find(varName).data[varName] = evalScheem(exp, env);
    } else if (fn === 'define') {
      const [varName, exp] = args;
      env.data[varName] = evalScheem(exp, env);
    } else if (fn === 'lambda') {
      const [vars, exp] = args;
      return function (...values: any[]) {
        const lambdaEnv = new Env(env);
        for (let i = 0; i < vars.length; i++) {
          lambdaEnv.data[vars[i]] = values[i];
        }
        return evalScheem(exp, lambdaEnv);
      };
    } else {
      const fnEval = evalScheem(fn, env);
      const argValues = args.map(arg => evalScheem(arg, env));
      return fnEval(...argValues);
    }
  }
}
