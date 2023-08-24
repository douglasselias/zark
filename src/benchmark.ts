import { evaluate } from "./evaluator"
import { read } from "./reader"

const benchmark = () => {
  const exp = `(define plus10 (lambda (x) (sum (sum (sum (sum (sum (sum (sum (sum (sum (sum (sum (sum (sum (sum 1 x) x) x) x) x) x) x) x) x) x) x) x) x) x)))
  
  (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 (plus10 10)))))))))))))))))
  `

  let t0 = performance.now()
  evaluate(read(exp))
  let t1 = performance.now()
  console.log("Call to evaluate expression took " + (t1 - t0) + " milliseconds.")
}

benchmark()