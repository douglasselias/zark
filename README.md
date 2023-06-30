# zark-lang-prototype

# TODO
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