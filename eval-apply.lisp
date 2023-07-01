;; Função eval - avalia uma expressão Lisp
(defun eval-zark (exp env)
  (cond ((atom exp) (lookup exp env))
        ((atom (car exp))
          (cond ((eq (car exp) 'quote) (cadr exp))
                ((eq (car exp) 'if) (if (eval-zark (cadr exp) env)
                                        (eval-zark (caddr exp) env)
                                        (eval-zark (cadddr exp) env)))
                ((eq (car exp) 'lambda)
                  (make-function (cadr exp) (caddr exp) env))
                (t (apply-zark (eval-zark (car exp) env)
                       (evlis (cdr exp) env) env))))
        (t (apply-zark (eval-zark (car exp) env)
               (evlis (cdr exp) env) env))))

(defun error-zark (message atom)
  (format t "Erro: ~a ~a~%" message (princ-to-string atom)))

;; Função apply - aplica uma função a uma lista de argumentos
(defun apply-zark (fn args env)
  (cond ((builtin? fn) (apply-builtin fn args))
        ((function? fn)
         (eval-zark (function-body fn)
               (extend args (function-environment fn) env)))
        (t (error-zark "Função inválida" fn))))

;; Função auxiliar function? - verifica se um objeto é uma função
(defun function? (obj)
  (and (listp obj) (eq (car obj) 'function)))

;; Função auxiliar function-body - retorna o corpo de uma função
(defun function-body (fn)
  (nth 2 fn))

;; Função auxiliar function-environment - retorna o ambiente de uma função
(defun function-environment (fn)
  (nth 3 fn))

;; Função auxiliar evlis - avalia uma lista de expressões Lisp
(defun evlis (exps env)
  (mapcar (lambda (exp) (eval-zark exp env)) exps))

;; Função auxiliar lookup - procura o valor associado a um símbolo no ambiente
(defun lookup (symbol env)
  (cond ((null env) (error-zark "Variável não definida" symbol))
        ((eq (caar env) symbol) (cdar env))
        (t (lookup symbol (cdr env)))))

;; Função auxiliar extend - estende o ambiente com novas variáveis e valores
(defun extend (vars vals env)
  (cons (mapcar 'list vars vals) env))

;; Função memq - verifica se um elemento está presente em uma lista
(defun memq (element list)
  (cond ((null list) nil)
        ((eq element (car list)) list)
        (t (memq element (cdr list)))))

;; Função auxiliar builtin? - verifica se um símbolo é uma função embutida
(defun builtin? (symbol)
  (memq symbol '(+ - * /)))

;; Função auxiliar apply-builtin - aplica uma função embutida aos argumentos
(defun apply-builtin (fn args)
  (cond ((eq fn '+) (apply '+ args))
        ((eq fn '-) (apply '- args))
        ((eq fn '*) (apply '* args))
        ((eq fn '/) (apply '/ args))
        (t (error-zark "Função embutida inválida" fn))))

;; Função auxiliar make-function - cria um objeto de função Lisp
(defun make-function (parameters body env)
  (list 'function parameters body env))

;; Exemplo de uso
(defparameter *global-env* nil) ; Ambiente global vazio

(eval-zark '(setq x 10) *global-env*) ; Definindo a variável x

(eval-zark '(+ x 20) *global-env*) ; Avaliando a expressão (+ x 20)
