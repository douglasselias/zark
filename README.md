## What is Zark?

Zark is a lisp dialect prototype to understand about how compilers work

Start the interpreter with `npm start`

Sample:

```lisp
(define factorial (lambda (n)
  (do 
    (define acc n)
    (while (less-than n 2)
      (do 
        (set n (sub n 1))
        (set acc (mul acc n))))
    acc)))

(factorial 6)
```

## Documentation

Zark supports numbers, strings and lists

```lisp
; Define a value
(define name "Zark")

; Set a value
(set name "Lisp")

; Define a function
(define is-even? (lambda (a)
  (even? a)))

; Declare a block of code
(do ...)

; Builtin function 'car' to get first element of list
(define odd-numbers (list 1 3 5 7 9))
(car odd-numbers) ; 1

; Explore src/evaluator.ts, src/env.ts to discover all available functions
```