# zark-lang-prototype

# TODO
- [] Add full line editing and command history support to your interpreter REPL. Many languages have a library/module that provide line editing support. Another option if your language supports it is to use an FFI (foreign function interface) to load and call directly into GNU readline, editline, or linenoise library. Add line editing interface code to readline.qx


- [] Add support for the other basic data type to your reader and printer functions: string, nil, true, and false. Nil, true, and false become mandatory at step 4, strings at step 6. When a string is read, the following transformations are applied: a backslash followed by a doublequote is translated into a plain doublequote character, a backslash followed by "n" is translated into a newline, and a backslash followed by another backslash is translated into a single backslash. To properly print a string (for step 4 string functions), the pr_str function needs another parameter called print_readably. When print_readably is true, doublequotes, newlines, and backslashes are translated into their printed representations (the reverse of the reader). The PRINT function in the main program should call pr_str with print_readably set to true.

- [] Add support for reader macros which are forms that are transformed into other forms during the read phase. Refer to tests/step1_read_print.mal for the form that these macros should take (they are just simple transformations of the token stream).

- [] Add comment support to your reader. The tokenizer should ignore tokens that start with ";". Your read_str function will need to properly handle when the tokenizer returns no values. The simplest way to do this is to return nil mal value. A cleaner option (that does not print nil at the prompt is to throw a special exception that causes the main loop to simply continue at the beginning of the loop without calling rep.)