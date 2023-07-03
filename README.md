## What is Zark?

Zark is a lisp dialect prototype tha aims to rethink common established paradigms and be a small and concise language like scheme, with high expressive power [see paul graham link](), and performance. Somewhat geared towards making games and joy of programming (look almost pseudocode, easy to make algorithms)

DISCLAIMER: 
this is very biased and hindsighthed, since every person has his own bias and this is my first atempt to write a programming language/compiler, so I not very knowledgeble.
my attempt is to at least write a good® programming language where I can use in the place of JS/TS in my side projects/games
it also suffers from the "benevolent dictator" since I own this, and everything would need my approval to enter the language, unless you fork it

## Why create a new language? There are dozens already? It's just [XCDK comic]() all over again

Yes, there are dozens already, [Crystal](), [Nim](), [Rust](), espcially Lisp dialects, [Clojure](), [Racket](),[Carp]() etc...

But: Inspiration: Linus Lee, John Blow, [please reinvent the wheel](https://george3d6.medium.com/please-reinvent-the-wheel-7690ccc454bf)

Like Linus, I aim to use this as my main language for creating programs/websites, replacing JS and also React.

will try to document my progress

First, why Lisp? short answer: 
- macros (game dev: macro for input that creates ifs) (how lists make better vector2 and vector3 operations)
- simple parser/syntax
- parenthesis (LOL)
- beating the averages (good selling blog post)
- have high quality error messages, like Rust and Elm
- REPL based development
- have a first in class docs
- principle of least surprise

But my big idea is to create a lisp with all the best features of other languages while being small. By comparing how each language does a specific thing and determine the most 'readable' among them or specifying something different
for example: in OCaml you define variable with let, in JS you can use let, in Scheme is define and Ruby you dont have a keyword. So which is most declarative? does let convey the meaning o creating a variable? For me, would be Scheme, but another question arises, do we really need a keyword for defining variables? for someone completely new to a language (like Zark), they would have trouble understanding this:
`(pi 3.14)` rather than this `(define pi 3.14)`

Other example is math operators, we are used to this `(+ 1 2)`
but with lisp you have _reader macros_ therefore you would need to rewrite stuff, how about we use only ascii chars like this `(sum 1 2)`

So each tiny part of the Zark language will be a comparison of other languages and be chosen the __Best®__ , this is an approach that I neve saw in any other language.

Will use english language as base for good® code

So I will try outweight the pros against the cons, and also consider long term standards, like ";", should we change it's meaning? almost every programmer will see as ending statements or in lisp as comments, it's in their ~~DNS~~ DNA 

Will look into SICP, abstracting data by operations

I will also look the the 7 UR-languages and compare

Other features that I will analyze:

- call/cc | restart system (like CL)
- have a image base system ? like CL?
- Gradual types (hindler milner types)
- Memory management (GC, Borrow, Generational Counting)
- FFI C
- Convert other languages to Zark (few languages like C, C++, Rust) (also small subset)
- Compile Zark to other languages (just few langs, C,C++, Rust, JS) (also small subset)
- Maybe some seamless interop with those languages mentioned above
- Provable functions? Dafny
- compile to LLVM
- compile to WASM (WASI)
- possibly some converter from other lisps to Zark
- low level types? (uint8, int64, etc...)
- low level functions? (malloc, free) (see also how jai allocates memory)
- no OOP (will be carefully analyzed if something like CLOS is useful)
- should have method dispatch?
- Lisp1 or Lisp2 ? (any difference in assembly? performance? complexity of the compiler code?)
- Compare each construct how they map to assembly (like callback is just a RET...)
- Multiple returns
- Numeric tower (floating point)
- math standard library, with support for matrix math (remember goal is to gamedev), which implies arrays
- string std lib (CL does not have a builtin split string by char like JS does `"(+ 2 3)".split(" ")`)
- hash tables, dictionaries, structs, etc, std lib support
- streams, lazy lists
- lazy evaluation, sometimes bad, (see heisenbug)
- try/catch/error handling
- continuation passing style


Also:

- package manager (like Rust does) (CL kinda suffers this for newbies)
- builtin test runner (like Rust does)
- code formatter (like Rust does)
- explore with algorithms in Zark to have a feel of how they look, if it's readable or not
- try to remove parens, especially in `let` declarations inside functions, (or should we call procedures?)
- have syntax highlighting in other code editors!
- have a package that abstracts the web (html, css, js)
- maybe have package with a web framework?
- compile to Android apps
- some way to interop with python? (make lisp rise again in the Machine Learning community)
- how package managers handle security, supply chain attacks? (should have a central repo, like npm? like rust does?)


Other goal I have in mind is that a programming language should be a abstraction of computation, (SICP)
we (programmers) should not worry about low level details,
only when necessary. It also abstracts the OS (like threads, UI, window) (probably embedded sysmtems will not be comtemplated, but Consoles will (nintendo switch))

An OS is an abstraction of hardware and application management (memory management)

And since we are at it, i will cover clean code, clean architecture, OOP, design patterns, KISS, YAGNI, etc, plus DDD, TDD, BDD, and other so called "best practices", why FP is best, some people cannot recomend clean code

we will see SOLID is not SOlid book, composing software by eric elliot, lenses is OOP? there is no use case where OOP is better than FP/Procedural

OOP is not OOP, according to alan key, inventor of... OOP

what is message passing?

where MVC, MVVM, observer and such apply in software?

maybe also talk about agile, kanban, scrum? maybe side note to blog

### Why not other languages?

Let's go over each one

- C
- C++
- Rust
- F#
- Haskell
- OCaml
- JS
- Elixir
- Common Lisp (staled standard, which is good, but we need breaking changes)
- Scheme
- Racket
- Carp (similar to what i'm doing)
- Otus Lisp (similar to what i'm doing)
- Shen (similar to what i'm doing)
- Janet (similar to what i'm doing)
- Forth
- Prolog
- Unison
- Ballerina
- Arc (which is written in Racket)
- Cake Lisp (similar to what i'm doing)
- Koka (research lang by Micro$oft)
- (other research langs)

## Which language to use to implement the compiler?

- TS (My main language) (at least initial release, since it's highly experimental)

Other options, Rust, C++, Haskell, F#, Elixir, Racket

Why not this other options? TODO LATER!

## Why not use Flex/Bison/Antlr?

High level of control of my code, maybe do both and compare performance?


## Future

- make a OS with this language (called ZYZ OS)
- make a browser (Zakur), but delegate JS engine to V8
- make a code editor similar to Emacs
- Excel clone with lean functionality, maybe only cmd line, maybe with graphics and a lisp (Zark) integration to program the tables, instead of creating weird formulas, use a real programming language
- make a 3D game that runs cross-platform including in this new OS
- retire...














---------------------
---------------------
---------------------
- [] Add full line editing and command history support to your interpreter REPL. Many languages have a library/module that provide line editing support. Another option if your language supports it is to use an FFI (foreign function interface) to load and call directly into GNU readline, editline, or linenoise library. Add line editing interface code to readline.qx


- [] Add support for the other basic data type to your reader and printer functions: string, nil, true, and false. Nil, true, and false become mandatory at step 4, strings at step 6. When a string is read, the following transformations are applied: a backslash followed by a doublequote is translated into a plain doublequote character, a backslash followed by "n" is translated into a newline, and a backslash followed by another backslash is translated into a single backslash. To properly print a string (for step 4 string functions), the pr_str function needs another parameter called print_readably. When print_readably is true, doublequotes, newlines, and backslashes are translated into their printed representations (the reverse of the reader). The PRINT function in the main program should call pr_str with print_readably set to true.

- [] Add support for reader macros which are forms that are transformed into other forms during the read phase. Refer to tests/step1_read_print.mal for the form that these macros should take (they are just simple transformations of the token stream).

- [] Add comment support to your reader. The tokenizer should ignore tokens that start with ";". Your read_str function will need to properly handle when the tokenizer returns no values. The simplest way to do this is to return nil mal value. A cleaner option (that does not print nil at the prompt is to throw a special exception that causes the main loop to simply continue at the beginning of the loop without calling rep.)

- [] Implement Clojure-style variadic function parameters. Modify the constructor/initializer for environments, so that if a "&" symbol is encountered in the binds list, the next symbol in the binds list after the "&" is bound to the rest of the exprs list that has not been bound yet.

- [] Call slurp to read in a file by name. Surround the contents with "(do ...)" so that the whole file will be treated as a single program AST (abstract syntax tree). Add a new line in case the files ends with a comment. The nil ensures a short and predictable result, instead of what happens to be the last function defined in the loaded file.

- [] Add the ability to run another mal program from the command line. Prior to the REPL loop, check if your mal implementation is called with command line arguments. If so, treat the first argument as a filename and use rep to call load-file on that filename, and finally exit/terminate execution.

- [] Add the rest of the command line arguments to your REPL environment so that programs that are run with load-file have access to their calling environment. Add a new "*ARGV*" (symbol) entry to your REPL environment. The value of this entry should be the rest of the command line arguments as a mal list value.

- []  The slurp function loads a file as a string, the read-string function calls the mal reader to turn that string into data, and the eval function takes data and evaluates it as a normal mal program. However, it is important to note that the eval function is not just for running external programs.
// core.mal: defined using the language itself
```lisp
rep("(def! not (fn* (a) (if a false true)))");
rep(`(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))`);
```

- [] Add the quasiquote function. The quasiquote function takes a parameter ast and has the following conditional.

If ast is a list starting with the "unquote" symbol, return its second element.

If ast is a list failing previous test, the result will be a list populated by the following process.

The result is initially an empty list. Iterate over each element elt of ast in reverse order:

If elt is a list starting with the "splice-unquote" symbol, replace the current result with a list containing: the "concat" symbol, the second element of elt, then the previous result.
Else replace the current result with a list containing: the "cons" symbol, the result of calling quasiquote with elt as argument, then the previous result.
This process can also be described recursively:

If ast is empty return it unchanged. else let elt be its first element.
If elt is a list starting with the "splice-unquote" symbol, return a list containing: the "concat" symbol, the second element of elt, then the result of processing the rest of ast.
Else return a list containing: the "cons" symbol, the result of calling quasiquote with elt as argument, then the result of processing the rest of ast.
If ast is a map or a symbol, return a list containing: the "quote" symbol, then ast.

Else return ast unchanged. Such forms are not affected by evaluation, so you may quote them as in the previous case if implementation is easier.

----

- [] token is "~" (tilde): return a new list that contains the symbol "unquote" and the result of reading the next form (read_form).

- [] token is "~@" (tilde + at sign): return a new list that contains the symbol "splice-unquote" and the result of reading the next form (read_form).

- [] Take your interpreter implementation and have it emit source code in the target language rather than immediately evaluating it. In other words, create a compiler.

- [] Implement a feature in your mal implementation that is not covered by this guide. Some ideas:
Namespaces
Multi-threading support
Errors with line numbers and/or stack traces.
Lazy sequences
Clojure-style protocols
Full call/cc (call-with-current-continuation) support
Explicit TCO (i.e. recur) with tail-position error checking