## What is Zark?

Zark is a lisp dialect prototype to understand about how compilers work

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