(define factorial (lambda (n)
  (do 
    (define acc n)
    (while (less-than n 2)
      (do 
        (set n (sub n 1))
        (set acc (mul acc n))
        (print acc)))
    acc)))