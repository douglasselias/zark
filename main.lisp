(defmacro bubble-sort (items predicate)
  `(let ((a (first items)) (b (last items))) 
    (if (,predicate a b) t nil)))

(bubble-sort '(10 2 1 5 9) #'(lambda (a b) (complex-compare a b)) )